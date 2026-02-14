"""
Tool selection logic - maps intents to MCP tools.
"""

from typing import Optional, Dict, Any, Tuple
import logging

from .schemas import IntentType

logger = logging.getLogger(__name__)


class ToolSelector:
    """Maps detected intents to appropriate MCP tools."""

    # Intent-to-tool mapping
    INTENT_TOOL_MAP = {
        IntentType.CREATE_TASK: "add_task",
        IntentType.LIST_TASKS: "list_tasks",
        IntentType.COMPLETE_TASK: "complete_task",
        IntentType.UPDATE_TASK: "update_task",
        IntentType.DELETE_TASK: "delete_task",
    }

    @staticmethod
    def select_tool(
        intent: IntentType,
        confidence: float,
        parameters: Dict[str, Any]
    ) -> Tuple[Optional[str], Optional[str]]:
        """
        Select appropriate MCP tool based on intent.

        Args:
            intent: Detected intent
            confidence: Confidence score (0.0-1.0)
            parameters: Extracted parameters

        Returns:
            (tool_name, error_message)
            tool_name is None if no tool should be executed
            error_message is None if no error
        """
        # Check confidence threshold
        if confidence < 0.6:
            logger.warning(f"[tool_selector] low_confidence intent={intent} confidence={confidence}")
            return (
                None,
                f"I'm not confident about what you want to do (confidence: {confidence:.0%}). Can you rephrase that?"
            )

        # Handle non-tool intents
        if intent in [IntentType.GREETING, IntentType.CLARIFY]:
            return (None, None)

        if intent == IntentType.UNKNOWN:
            return (
                None,
                "I didn't understand that. Try 'add task title', 'show my tasks', 'mark task #1 as done', or 'delete task #1'."
            )

        # Map intent to tool
        tool_name = ToolSelector.INTENT_TOOL_MAP.get(intent)

        if not tool_name:
            logger.error(f"[tool_selector] no_tool_mapping intent={intent}")
            return (
                None,
                f"I recognized your intent ({intent.value}) but don't know how to handle it yet."
            )

        # Validate parameters based on tool requirements
        error = ToolSelector._validate_parameters(tool_name, parameters)
        if error:
            return (None, error)

        logger.info(f"[tool_selector] selected tool={tool_name} intent={intent} confidence={confidence}")
        return (tool_name, None)

    @staticmethod
    def _validate_parameters(tool_name: str, parameters: Dict[str, Any]) -> Optional[str]:
        """
        Validate that required parameters are present for the tool.

        Returns:
            Error message if validation fails, None if valid
        """
        if tool_name == "add_task":
            if not parameters.get("title"):
                return "I need a task title. What should I create?"

        elif tool_name in ["complete_task", "update_task", "delete_task"]:
            # These need a task identifier (ID, index, or title fragment)
            has_id = parameters.get("task_id")
            has_index = parameters.get("task_index") is not None
            has_identifier = parameters.get("task_identifier")

            if not (has_id or has_index or has_identifier):
                action = tool_name.replace("_task", "")
                return f"Which task should I {action}? Please specify a task number or title."

            # Update tool needs at least one field to update
            if tool_name == "update_task":
                if not parameters.get("new_title") and not parameters.get("new_description"):
                    return "What should I update? Please specify the new title or description."

        return None

    @staticmethod
    def get_fallback_action(intent: IntentType) -> Optional[str]:
        """Get fallback action if tool execution fails."""
        fallback_map = {
            IntentType.CREATE_TASK: "You can try 'add task title'",
            IntentType.LIST_TASKS: "You can try 'show my tasks'",
            IntentType.COMPLETE_TASK: "You can try 'mark task #1 as done'",
            IntentType.UPDATE_TASK: "You can try 'update task #1 to new title'",
            IntentType.DELETE_TASK: "You can try 'delete task #1'",
        }
        return fallback_map.get(intent)
