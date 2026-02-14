"""
MCP (Model Context Protocol) tool definitions for task operations.

Exposes five stateless tools (add_task, list_tasks, complete_task, update_task, delete_task)
for the OpenAI Agents SDK to call. All tools enforce user isolation via JWT-extracted user_id.

Tools follow the Official MCP SDK pattern and return structured JSON responses.
"""

from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime, timezone, timedelta

# Pakistan Standard Time (UTC+5)
PKT = timezone(timedelta(hours=5))
import logging

logger = logging.getLogger(__name__)


class TaskToolResponse:
    """Structured response format for all task tools."""

    @staticmethod
    def success(data: Any) -> Dict[str, Any]:
        """Return a success response."""
        return {"status": "success", "data": data}

    @staticmethod
    def error(code: str, message: str, details: Optional[Dict] = None) -> Dict[str, Any]:
        """Return an error response."""
        return {
            "status": "error",
            "error": {
                "code": code,
                "message": message,
                "details": details or {}
            }
        }

    @staticmethod
    def _to_pkt(dt: datetime) -> str:
        """Convert a datetime to Pakistan Standard Time (Asia/Karachi) ISO string."""
        if dt is None:
            return None
        # If naive, assume UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(PKT).isoformat()

    @staticmethod
    def task_to_dict(task) -> Dict[str, Any]:
        """Convert Task SQLModel to JSON-serializable dict with PKT timestamps."""
        if task is None:
            return None
        return {
            "id": str(task.id),
            "user_id": task.user_id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "created_at": TaskToolResponse._to_pkt(task.created_at),
            "updated_at": TaskToolResponse._to_pkt(task.updated_at),
        }


async def list_tasks_tool(session, user_id: str, status: Optional[str] = None) -> Dict[str, Any]:
    """
    List all tasks for the user, optionally filtered by status.

    Args:
        session: AsyncSession for database access
        user_id: User ID from JWT (enforces user isolation)
        status: Optional filter - "pending", "completed", or "all" (default: all)

    Returns:
        {status: "success", data: [{task1}, {task2}, ...]}
        or {status: "error", error: {code, message, details}}
    """
    try:
        # Validate status parameter
        if status and status not in ["pending", "completed", "all"]:
            logger.warning(f"[list_tasks] user_id={user_id} invalid_status={status}")
            return TaskToolResponse.error(
                "INVALID_STATUS",
                f"Status must be 'pending', 'completed', or 'all', got '{status}'",
                {"received": status}
            )

        # Import here to avoid circular imports
        from src.services.task_service import get_user_tasks
        from src.models.task import Task

        # Get all tasks for user
        tasks = get_user_tasks(session=session, user_id=user_id)

        # Filter by status if requested
        if status == "pending":
            tasks = [t for t in tasks if not t.completed]
        elif status == "completed":
            tasks = [t for t in tasks if t.completed]

        # Convert to JSON-serializable format
        result = [TaskToolResponse.task_to_dict(t) for t in tasks]

        logger.info(f"[list_tasks] user_id={user_id} status={status} count={len(result)}")
        return TaskToolResponse.success(result)

    except Exception as e:
        logger.error(f"[list_tasks] user_id={user_id} error={str(e)}")
        return TaskToolResponse.error(
            "INTERNAL_ERROR",
            "Failed to list tasks",
            {"error": str(e)}
        )


async def add_task_tool(session, user_id: str, title: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a new task for the user.

    Args:
        session: AsyncSession for database access
        user_id: User ID from JWT (enforces user isolation)
        title: Task title (required, 1-500 characters)
        description: Task description (optional, 0-5000 characters)

    Returns:
        {status: "success", data: {id, user_id, title, description, completed: false, created_at, updated_at}}
        or {status: "error", error: {code, message, details}}
    """
    try:
        # Validate title
        if not title or not isinstance(title, str):
            logger.warning(f"[add_task] user_id={user_id} missing_title")
            return TaskToolResponse.error(
                "INVALID_TITLE",
                "Title is required and must be a string",
                {"received_type": type(title).__name__}
            )

        if len(title) < 1 or len(title) > 500:
            logger.warning(f"[add_task] user_id={user_id} invalid_title_length={len(title)}")
            return TaskToolResponse.error(
                "INVALID_TITLE",
                "Title must be 1-500 characters",
                {"received_length": len(title)}
            )

        # Validate description
        if description and len(description) > 5000:
            logger.warning(f"[add_task] user_id={user_id} invalid_description_length={len(description)}")
            return TaskToolResponse.error(
                "INVALID_DESCRIPTION",
                "Description must be 0-5000 characters",
                {"received_length": len(description)}
            )

        # Enforce user isolation
        if not user_id:
            logger.error(f"[add_task] missing_user_id")
            return TaskToolResponse.error(
                "UNAUTHORIZED",
                "User not authenticated",
                {}
            )

        # Import here to avoid circular imports
        from src.services.task_service import create_task
        from src.models.task import TaskCreate

        # Create task
        task_create = TaskCreate(title=title, description=description)
        task = create_task(session=session, task_create=task_create, user_id=user_id)

        result = TaskToolResponse.task_to_dict(task)
        logger.info(f"[add_task] user_id={user_id} task_id={task.id}")
        return TaskToolResponse.success(result)

    except Exception as e:
        logger.error(f"[add_task] user_id={user_id} error={str(e)}")
        return TaskToolResponse.error(
            "INTERNAL_ERROR",
            "Failed to create task",
            {"error": str(e)}
        )


async def complete_task_tool(session, user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Mark a task as completed.

    Args:
        session: AsyncSession for database access
        user_id: User ID from JWT (enforces user isolation)
        task_id: UUID of the task to complete

    Returns:
        {status: "success", data: {id, ..., completed: true, updated_at}}
        or {status: "error", error: {code, message, details}}
    """
    try:
        # Parse task_id
        try:
            task_uuid = UUID(task_id)
        except (ValueError, TypeError):
            logger.warning(f"[complete_task] user_id={user_id} invalid_task_id={task_id}")
            return TaskToolResponse.error(
                "INVALID_TASK_ID",
                f"Invalid task ID format: {task_id}",
                {"received": task_id}
            )

        # Import here to avoid circular imports
        from src.services.task_service import toggle_task_completion

        # Get task and verify ownership
        task = toggle_task_completion(session=session, task_id=task_uuid, user_id=user_id)

        if task is None:
            logger.warning(f"[complete_task] user_id={user_id} task_not_found_or_not_owned task_id={task_id}")
            return TaskToolResponse.error(
                "NOT_FOUND",
                "Task not found or user does not own this task",
                {"task_id": task_id}
            )

        # Ensure task is marked as completed
        if not task.completed:
            task.completed = True
            session.add(task)
            session.commit()
            session.refresh(task)

        result = TaskToolResponse.task_to_dict(task)
        logger.info(f"[complete_task] user_id={user_id} task_id={task_id} completed={task.completed}")
        return TaskToolResponse.success(result)

    except Exception as e:
        logger.error(f"[complete_task] user_id={user_id} task_id={task_id} error={str(e)}")
        return TaskToolResponse.error(
            "INTERNAL_ERROR",
            "Failed to complete task",
            {"error": str(e)}
        )


async def update_task_tool(
    session, user_id: str, task_id: str, title: Optional[str] = None, description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Update a task's title and/or description.

    Args:
        session: AsyncSession for database access
        user_id: User ID from JWT (enforces user isolation)
        task_id: UUID of the task to update
        title: New title (optional, 1-500 characters)
        description: New description (optional, 0-5000 characters)

    Returns:
        {status: "success", data: {id, ..., title, description, updated_at}}
        or {status: "error", error: {code, message, details}}
    """
    try:
        # Check if at least one field to update
        if title is None and description is None:
            logger.warning(f"[update_task] user_id={user_id} task_id={task_id} no_fields_to_update")
            return TaskToolResponse.error(
                "NO_UPDATE_FIELDS",
                "Must provide at least one field to update (title or description)",
                {}
            )

        # Validate title if provided
        if title is not None:
            if len(title) < 1 or len(title) > 500:
                logger.warning(f"[update_task] user_id={user_id} task_id={task_id} invalid_title_length={len(title)}")
                return TaskToolResponse.error(
                    "INVALID_TITLE",
                    "Title must be 1-500 characters",
                    {"received_length": len(title)}
                )

        # Validate description if provided
        if description is not None and len(description) > 5000:
            logger.warning(f"[update_task] user_id={user_id} task_id={task_id} invalid_description_length={len(description)}")
            return TaskToolResponse.error(
                "INVALID_DESCRIPTION",
                "Description must be 0-5000 characters",
                {"received_length": len(description)}
            )

        # Parse task_id
        try:
            task_uuid = UUID(task_id)
        except (ValueError, TypeError):
            logger.warning(f"[update_task] user_id={user_id} invalid_task_id={task_id}")
            return TaskToolResponse.error(
                "INVALID_TASK_ID",
                f"Invalid task ID format: {task_id}",
                {"received": task_id}
            )

        # Import here to avoid circular imports
        from src.services.task_service import update_task
        from src.models.task import TaskUpdate

        # Update task
        task_update = TaskUpdate(title=title, description=description)
        task = update_task(session=session, task_id=task_uuid, task_update=task_update, user_id=user_id)

        if task is None:
            logger.warning(f"[update_task] user_id={user_id} task_not_found_or_not_owned task_id={task_id}")
            return TaskToolResponse.error(
                "NOT_FOUND",
                "Task not found or user does not own this task",
                {"task_id": task_id}
            )

        result = TaskToolResponse.task_to_dict(task)
        logger.info(f"[update_task] user_id={user_id} task_id={task_id} fields_updated={'title' if title else 'none'},{'description' if description else 'none'}")
        return TaskToolResponse.success(result)

    except Exception as e:
        logger.error(f"[update_task] user_id={user_id} task_id={task_id} error={str(e)}")
        return TaskToolResponse.error(
            "INTERNAL_ERROR",
            "Failed to update task",
            {"error": str(e)}
        )


async def delete_task_tool(session, user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Delete a task permanently.

    Args:
        session: AsyncSession for database access
        user_id: User ID from JWT (enforces user isolation)
        task_id: UUID of the task to delete

    Returns:
        {status: "success", data: {message: "Task deleted"}}
        or {status: "error", error: {code, message, details}}
    """
    try:
        # Parse task_id
        try:
            task_uuid = UUID(task_id)
        except (ValueError, TypeError):
            logger.warning(f"[delete_task] user_id={user_id} invalid_task_id={task_id}")
            return TaskToolResponse.error(
                "INVALID_TASK_ID",
                f"Invalid task ID format: {task_id}",
                {"received": task_id}
            )

        # Import here to avoid circular imports
        from src.services.task_service import delete_task

        # Delete task
        success = delete_task(session=session, task_id=task_uuid, user_id=user_id)

        if not success:
            logger.warning(f"[delete_task] user_id={user_id} task_not_found_or_not_owned task_id={task_id}")
            return TaskToolResponse.error(
                "NOT_FOUND",
                "Task not found or user does not own this task",
                {"task_id": task_id}
            )

        logger.info(f"[delete_task] user_id={user_id} task_id={task_id}")
        return TaskToolResponse.success({"message": "Task deleted"})

    except Exception as e:
        logger.error(f"[delete_task] user_id={user_id} task_id={task_id} error={str(e)}")
        return TaskToolResponse.error(
            "INTERNAL_ERROR",
            "Failed to delete task",
            {"error": str(e)}
        )


# Tool registry for MCP server discovery
TASK_TOOLS = {
    "list_tasks": {
        "name": "list_tasks",
        "description": "List all tasks for the user, optionally filtered by status (pending, completed, or all)",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID from JWT token (automatically extracted)"
                },
                "status": {
                    "type": "string",
                    "enum": ["pending", "completed", "all"],
                    "description": "Filter tasks by status (default: all)"
                }
            },
            "required": ["user_id"]
        },
        "handler": list_tasks_tool
    },
    "add_task": {
        "name": "add_task",
        "description": "Create a new task",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID from JWT token (automatically extracted)"
                },
                "title": {
                    "type": "string",
                    "description": "Task title (1-500 characters)"
                },
                "description": {
                    "type": "string",
                    "description": "Optional task description (0-5000 characters)"
                }
            },
            "required": ["user_id", "title"]
        },
        "handler": add_task_tool
    },
    "complete_task": {
        "name": "complete_task",
        "description": "Mark a task as completed",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID from JWT token (automatically extracted)"
                },
                "task_id": {
                    "type": "string",
                    "description": "UUID of the task to complete"
                }
            },
            "required": ["user_id", "task_id"]
        },
        "handler": complete_task_tool
    },
    "update_task": {
        "name": "update_task",
        "description": "Update a task's title and/or description",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID from JWT token (automatically extracted)"
                },
                "task_id": {
                    "type": "string",
                    "description": "UUID of the task to update"
                },
                "title": {
                    "type": "string",
                    "description": "New title (optional, 1-500 characters)"
                },
                "description": {
                    "type": "string",
                    "description": "New description (optional, 0-5000 characters)"
                }
            },
            "required": ["user_id", "task_id"]
        },
        "handler": update_task_tool
    },
    "delete_task": {
        "name": "delete_task",
        "description": "Delete a task permanently",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID from JWT token (automatically extracted)"
                },
                "task_id": {
                    "type": "string",
                    "description": "UUID of the task to delete"
                }
            },
            "required": ["user_id", "task_id"]
        },
        "handler": delete_task_tool
    }
}
