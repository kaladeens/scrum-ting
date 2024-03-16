from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import date, datetime


class UserBase(BaseModel):
    username: str
    role: str
    sprint_id: Optional[int] = None  # This field indicates which sprint the user is currently working on. If None, the user is not working on a sprint.

class UserCreate(UserBase):
    password: str
    first_time_login: bool = True

class LoginResponse(BaseModel):
    role: str = None  # This will be None if the login is unsuccessful

class LoginRequest(BaseModel):
    username: str
    password: str

class User(UserCreate):
    user_id: int

    class Config:
        orm_mode = True

class TaskBase(BaseModel):
    name: str
    task_type: str
    story_points: int
    description: str
    status: str
    assigned_to: int
    sprint_id: Optional[int] = None  # This field indicates which sprint the task belongs to. If None, it's in the backlog.

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    task_id: int  
    time_spent: Optional[int] = 0

    class Config:
        orm_mode = True

class SprintBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    status: str

    @validator("end_date", pre=True, always=True)
    def end_date_must_be_after_start_date(cls, end_date, values):
        """Ensure the end date of the sprint is after the start date."""
        start_date = values.get("start_date")
        
        if isinstance(start_date, str):
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        else:
            start_date_obj = start_date

        # Ensure end_date is a datetime.date object
        if isinstance(end_date, str):
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()
        else:
            end_date_obj = end_date

        if start_date and end_date_obj <= start_date_obj:
            raise ValueError("end_date must be after start_date")
        return end_date_obj



class SprintCreate(SprintBase):
    pass

class Sprint(SprintBase):
    sprint_id: int
    tasksToDo: List[int] = []          # Tasks that need to be done
    tasksInProgress: List[int] = []    # Tasks currently in progress
    tasksDone: List[int] = []          # Tasks that have been completed

    class Config:
        orm_mode = True
class SprintUpdate(BaseModel):
    tasksToDo: List[int] = []
    tasksInProgress: List[int] = []
    tasksDone: List[int] = []


""" class BurndownBase(BaseModel):
    name: str

class BurndownCreate(BurndownBase):
    pass

class Burndown(BurndownBase):
    burndown_id = int        # Tasks that have been completed
    sprint = Sprint
    startDate = date
    endDate = date
    progress = dict
    notDone = list[Task] # tasks that are incomplete


    class Config:
        orm_mode = True

class BurndownUpdate(BaseModel):
    blank = None """