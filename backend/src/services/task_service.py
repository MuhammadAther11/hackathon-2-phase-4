from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID
from src.models.task import Task, TaskCreate, TaskUpdate

def get_user_tasks(*, session: Session, user_id: str) -> List[Task]:
    """Get all tasks for a specific user."""
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()
    return tasks

def create_task(*, session: Session, task_create: TaskCreate, user_id: str) -> Task:
    """Create a new task for a user."""
    task = Task(**task_create.model_dump(), user_id=user_id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def get_task_by_id(*, session: Session, task_id: UUID, user_id: str) -> Optional[Task]:
    """Get a specific task by ID if it belongs to the user."""
    task = session.get(Task, task_id)
    if task and str(task.user_id) == user_id:
        return task
    return None

def update_task(*, session: Session, task_id: UUID, task_update: TaskUpdate, user_id: str) -> Optional[Task]:
    """Update a task if it belongs to the user."""
    db_task = session.get(Task, task_id)
    if not db_task or str(db_task.user_id) != user_id:
        return None

    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_task(*, session: Session, task_id: UUID, user_id: str) -> bool:
    """Delete a task if it belongs to the user."""
    db_task = session.get(Task, task_id)
    if not db_task or str(db_task.user_id) != user_id:
        return False

    session.delete(db_task)
    session.commit()
    return True

def toggle_task_completion(*, session: Session, task_id: UUID, user_id: str) -> Optional[Task]:
    """Toggle the completion status of a task if it belongs to the user."""
    db_task = session.get(Task, task_id)
    if not db_task or str(db_task.user_id) != user_id:
        return None

    db_task.completed = not db_task.completed
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task