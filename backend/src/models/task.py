"""
Task entity and schemas for MCP tool operations.

Implements SQLModel entity with field validation, timestamps, and database constraints.
All timestamps are in Asia/Karachi (PKT, UTC+5). Task completion is terminal (once completed, cannot be uncompleted).
"""

from typing import Optional
from datetime import datetime, timezone, timedelta
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Column, DateTime
from pydantic import Field as PydanticField

# Pakistan Standard Time (UTC+5)
PKT = timezone(timedelta(hours=5))


class Task(SQLModel, table=True):
    """
    Task entity persisted in PostgreSQL.

    Represents a to-do item owned by a user. All operations are user-scoped via user_id.
    Timestamps are stored in Asia/Karachi (PKT, UTC+5).

    Attributes:
        id: Unique task identifier (UUID)
        user_id: Owner of the task (from JWT 'sub' claim), indexed for query performance
        title: Task title (required, 1-500 characters)
        description: Task description (optional, 0-5000 characters)
        completed: Whether task is completed (default False, terminal once set to True)
        created_at: PKT timestamp when task was created (immutable)
        updated_at: PKT timestamp when task was last modified (auto-updated)
    """

    __tablename__ = "tasks"

    # Primary Key
    id: Optional[UUID] = Field(
        default_factory=uuid4,
        primary_key=True,
        description="Unique task identifier (UUID v4)"
    )

    # Foreign Key (User)
    user_id: str = Field(
        ...,
        min_length=1,
        max_length=256,
        index=True,
        description="Owner of the task (from JWT 'sub' claim)"
    )

    # Core Fields with Validation
    title: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Task title (required, 1-500 characters)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Task description (optional, 0-5000 characters)"
    )

    # Status
    completed: bool = Field(
        default=False,
        description="Whether task is completed (terminal once set to True)"
    )

    # Timestamps (stored in PKT / Asia/Karachi)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(PKT),
        sa_column=Column(DateTime(timezone=True), nullable=False),
        description="PKT timestamp when task was created (immutable)"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(PKT),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            onupdate=lambda: datetime.now(PKT)
        ),
        description="PKT timestamp when task was last modified (auto-updated)"
    )

    class Config:
        """SQLModel configuration"""
        validate_assignment = True
        json_encoders = {
            datetime: lambda dt: (
                dt.astimezone(PKT).isoformat()
                if dt and dt.tzinfo
                else dt.replace(tzinfo=timezone.utc).astimezone(PKT).isoformat()
                if dt
                else None
            )
        }


# Pydantic schemas for API I/O (used by MCP tools)

class TaskCreate(SQLModel):
    """Schema for creating a new task via MCP add_task tool"""
    title: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Task title (required, 1-500 characters)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Task description (optional, 0-5000 characters)"
    )


class TaskUpdate(SQLModel):
    """Schema for updating an existing task via MCP update_task tool"""
    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=500,
        description="Task title (optional, 1-500 characters if provided)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Task description (optional, 0-5000 characters if provided)"
    )


class TaskResponse(SQLModel):
    """Schema for task responses from MCP tools"""
    id: UUID = Field(..., description="Task ID")
    user_id: str = Field(..., description="Task owner")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(..., description="Task description")
    completed: bool = Field(..., description="Whether task is completed")
    created_at: datetime = Field(..., description="UTC creation timestamp")
    updated_at: datetime = Field(..., description="UTC last update timestamp")


class TaskListResponse(SQLModel):
    """Schema for list_tasks tool response"""
    tasks: list[TaskResponse] = Field(..., description="List of tasks")
    count: int = Field(..., description="Total task count")
    status_filter: Optional[str] = Field(
        default=None,
        description="Applied status filter (pending, completed, or None for all)"
    )
