"""
Intent detection logic using pattern matching and OpenAI completion.
"""

import re
from typing import Dict, Any, Tuple, Optional
import logging

from .schemas import IntentType

logger = logging.getLogger(__name__)


class IntentDetector:
    """Detects user intent from natural language messages."""

    # Intent patterns (simple keyword matching as fallback)
    PATTERNS = {
        IntentType.CREATE_TASK: [
            r"\b(create|add|new|make)\s+(a\s+)?(task|todo|item)",
            r"\bremind me to\b",
            r"\bi need to\b",
            r"^(create|add|new)\b",
        ],
        IntentType.LIST_TASKS: [
            r"\b(show|list|display|get|view)\s+(my\s+)?(tasks?|todos?|items?)",
            r"\b(show|display)\s+(my\s+)?(pending|completed|all)",
            r"\bwhat('?s|\s+is)\s+(on\s+)?my\s+(list|todo|tasks?)",
            r"\bshow\s+me\s+(everything|all)",
            r"^(list|show)\b",
        ],
        IntentType.COMPLETE_TASK: [
            r"\b(complete|finish|done|mark)\s+(task|todo|item)?",
            r"\bmark\s+.+\s+as\s+(complete|done)",
            r"\bi('ve|\s+have)\s+(finished|completed|done)",
        ],
        IntentType.UPDATE_TASK: [
            r"\b(update|edit|change|modify)\s+(task|todo|item|my)",
            r"\b(edit|update)\s+(my\s+)?(first|second|third|\d+)",
            r"\brename\s+(task|todo|item)",
            r"\bchange\s+.+\s+to\b",
            r"\b(update|edit|change)\s+.+\s+(?:to|with)\b",
        ],
        IntentType.DELETE_TASK: [
            r"\b(delete|remove|cancel)\s+(task|todo|item|my|the)",
            r"\b(remove|delete)\s+(my\s+)?(first|second|third|\d+)",
            r"\bget\s+rid\s+of\b",
            r"\bdelete\b",
        ],
        IntentType.GREETING: [
            r"^(hi|hello|hey|greetings)\b",
            r"\bhow\s+are\s+you",
        ],
    }

    @staticmethod
    def detect_intent(message: str) -> Tuple[IntentType, float, Dict[str, Any]]:
        """
        Detect intent from user message using pattern matching.

        Args:
            message: User's natural language message

        Returns:
            (intent_type, confidence_score, extracted_parameters)
        """
        message_lower = message.lower().strip()

        # Check greeting first
        if IntentDetector._match_patterns(message_lower, IntentType.GREETING):
            return (IntentType.GREETING, 0.95, {})

        # Check task intents
        for intent, patterns in IntentDetector.PATTERNS.items():
            if intent == IntentType.GREETING:
                continue

            if IntentDetector._match_patterns(message_lower, intent):
                # Extract parameters based on intent
                params = IntentDetector._extract_parameters(message, intent)
                confidence = 0.8 if params else 0.7
                return (intent, confidence, params)

        # No clear intent detected
        logger.warning(f"[intent_detector] unclear_intent message='{message[:50]}'")
        return (IntentType.UNKNOWN, 0.3, {})

    @staticmethod
    def _match_patterns(message: str, intent: IntentType) -> bool:
        """Check if message matches any pattern for given intent."""
        patterns = IntentDetector.PATTERNS.get(intent, [])
        for pattern in patterns:
            if re.search(pattern, message, re.IGNORECASE):
                return True
        return False

    @staticmethod
    def _extract_parameters(message: str, intent: IntentType) -> Dict[str, Any]:
        """
        Extract parameters from message based on intent.

        Simple extraction for now - can be enhanced with NER.
        """
        params = {}

        if intent == IntentType.CREATE_TASK:
            # Try to extract title after create/add/new
            match = re.search(
                r"(?:create|add|new|make|remind me to)\s+(?:a\s+)?(?:task\s+)?(?:to\s+)?(.+)",
                message,
                re.IGNORECASE
            )
            if match:
                params["title"] = match.group(1).strip()
            else:
                # If no clear pattern, use the whole message as title
                params["title"] = message.strip()

        elif intent == IntentType.LIST_TASKS:
            # Check for status filter
            if re.search(r"\b(pending|incomplete|open)\b", message, re.IGNORECASE):
                params["status"] = "pending"
            elif re.search(r"\b(completed|done|finished)\b", message, re.IGNORECASE):
                params["status"] = "completed"
            else:
                params["status"] = "all"

        elif intent in [IntentType.COMPLETE_TASK, IntentType.UPDATE_TASK, IntentType.DELETE_TASK]:
            # Try to extract task identifier (number, title fragment, or ID)
            # Look for numbers (task index) - supports #1, 1, etc.
            numbers = re.findall(r"#?(\d+)", message)
            if numbers:
                params["task_index"] = int(numbers[0])

            # Look for quoted text or text after "task"
            quote_match = re.search(r'["\'](.+?)["\']', message)
            if quote_match:
                params["task_identifier"] = quote_match.group(1)
            else:
                # Extract text after task/todo/item, stopping at update delimiters
                match = re.search(
                    r"(?:task|todo|item)\s+(.+?)(?:\s+(?:as|to|with)\b|$)",
                    message,
                    re.IGNORECASE
                )
                if match:
                    # Don't use raw number as identifier if we already have task_index
                    ident = match.group(1).strip().lstrip("#")
                    if not (ident.isdigit() and "task_index" in params):
                        params["task_identifier"] = match.group(1).strip()

            # For update, extract new title after "to", "with", or "as"
            if intent == IntentType.UPDATE_TASK:
                match = re.search(r"\b(?:to|with)\s+(.+)$", message, re.IGNORECASE)
                if match:
                    new_title = match.group(1).strip()
                    # Strip leading "task" if user wrote "with task buy milk"
                    new_title = re.sub(r"^task\s+", "", new_title, flags=re.IGNORECASE)
                    if new_title:
                        params["new_title"] = new_title

        return params

    @staticmethod
    def requires_confirmation(intent: IntentType) -> bool:
        """Check if intent requires user confirmation before execution."""
        return intent in [
            IntentType.DELETE_TASK,
            IntentType.COMPLETE_TASK,
        ]

    @staticmethod
    def generate_confirmation_text(intent: IntentType, params: Dict[str, Any]) -> str:
        """Generate user-friendly confirmation text."""
        if intent == IntentType.CREATE_TASK:
            title = params.get("title", "unnamed task")
            return f"I'll create a task: '{title}'. Should I go ahead?"

        elif intent == IntentType.LIST_TASKS:
            status = params.get("status", "all")
            return f"I'll show you {status} tasks."

        elif intent == IntentType.COMPLETE_TASK:
            identifier = params.get("task_identifier", params.get("task_index", "the task"))
            return f"I'll mark '{identifier}' as complete. Should I go ahead?"

        elif intent == IntentType.UPDATE_TASK:
            identifier = params.get("task_identifier", params.get("task_index", "the task"))
            new_title = params.get("new_title", "")
            if new_title:
                return f"I'll update '{identifier}' to '{new_title}'. Should I go ahead?"
            return f"I'll update '{identifier}'. What would you like to change?"

        elif intent == IntentType.DELETE_TASK:
            identifier = params.get("task_identifier", params.get("task_index", "the task"))
            return f"I'll delete '{identifier}'. This cannot be undone. Should I proceed?"

        elif intent == IntentType.GREETING:
            return "Hello! I'm your task assistant. How can I help you today?"

        else:
            return "I'm not sure what you want me to do. Can you rephrase that?"
