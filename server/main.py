from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
import json
import datetime
from flask import request

from pprint import pprint

from models import LoginRequest
from models import Sprint, SprintCreate
from models import SprintUpdate
origins = [
    "http://localhost:3000", 
    "http://localhost:8000", 

     # React default port
    # Add other origins if needed
]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper function for reading a file and writing:


class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.isoformat()
        return super(DateTimeEncoder, self).default(obj)
    

class TaskEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Task):
            return obj.__dict__
        return super(TaskEncoder, self).default(obj)


def read_data_from_file(filename: str):
    try:
        with open(filename, "r") as file:
            content = file.read()
            if not content:
                return []
            return json.loads(content)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        # Handle the error or log it
        print(f"Error reading file {filename}: {e}")
        return []


def write_data_to_file(filename: str, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4, cls=DateTimeEncoder)

def write_task_data_to_file(filename: str, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4, cls=TaskEncoder)


#Routes
from models import User, UserCreate, Task, TaskCreate

@app.post("/users/", response_model=User)
def create_user(user: UserCreate):
    users = read_data_from_file("./data/users.json")
    
    # Check if username already exists
    if any(existing_user["username"] == user.username for existing_user in users):
        raise HTTPException(status_code=400, detail="Username already exists")

    user_data = user.dict()
    user_id = len(users) + 1
    user_data["user_id"] = user_id
    users.append(user_data)
    write_data_to_file("./data/users.json", users)
    return user_data

##USERS

@app.post("/login/")
def login(request: LoginRequest):
    users = read_data_from_file("./data/users.json")
    user = next((user for user in users if user["username"] == request.username and user["password"] == request.password), None)
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # For simplicity, we're returning a message. In a real-world scenario, you'd return a token or session.
    return {"message": "Login successful!", "role": user["role"],"user_id": user["user_id"]}


@app.get("/users/", response_model=List[User])
def get_users():
    return read_data_from_file("./data/users.json")


@app.put("/users/{user_id}/", response_model=User)
def update_user(user_id: int, user: UserCreate):
    users = read_data_from_file("./data/users.json")
    user_to_update = next((user for user in users if user["user_id"] == user_id), None)
    
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")

    user_to_update.update(user.dict())
    write_data_to_file("./data/users.json", users)
    return user_to_update


@app.delete("/users/{user_id}/")
def delete_user(user_id: int):
    users = read_data_from_file("./data/users.json")
    user_to_delete = next((user for user in users if user["user_id"] == user_id), None)
    
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")

    users.remove(user_to_delete)
    write_data_to_file("./data/users.json", users)
    return {"message": "User deleted successfully"}


# TASKS
@app.post("/tasks/", response_model=Task)
def create_task(task: TaskCreate):
    tasks = read_data_from_file("./data/tasks.json")
    
    # Assigning a new task ID
    task_id = len(tasks) + 1
    task_data = task.dict()
    task_data["task_id"] = task_id
    task_data["status"] = "Not started"  # As per requirements
    tasks.append(task_data)

    # Update the sprint by adding the task id to tasksToDo
    sprints = read_data_from_file("./data/sprints.json")
    if task_data["sprint_id"]:
        sprint = next((s for s in sprints if s["sprint_id"] == task_data["sprint_id"]), None)
        if sprint:
            sprint["tasksToDo"].append(task_id)
            write_data_to_file("./data/sprints.json", sprints)

    write_data_to_file("./data/tasks.json", tasks)
    
    return task_data

@app.get("/tasks/{task_id}/", response_model=Task)
def get_task(task_id:int):
    tasks = read_data_from_file("./data/tasks.json")
    for task in tasks:
        if task['task_id'] == task_id:
            return task
        
    raise HTTPException(status_code=404, detail="Task not found")
 
@app.get("/tasks/tags/{tags}/", response_model=List[Task])
def get_tasks_by_tags(tags: str):
    tags = tags.split(',') # separate tasks by commas if multiple tags are provided
    tags = [tag.strip() for tag in tags]
    tags = [tag.lower() for tag in tags]
    tasks = read_data_from_file("./data/tasks.json")
    tagged_tasks = [task for task in tasks if tag in task['tags'] for tag in tags]
    return tagged_tasks

@app.get("/tasks/user/{user_id}/", response_model=List[Task])
def get_tasks_by_user(user_id: int):
    tasks = read_data_from_file("./data/tasks.json")
    assigned_tasks = [task for task in tasks if task['assigned_to'] == user_id]
    return assigned_tasks


@app.get("/tasks/", response_model=List[Task])
def get_tasks():
    return read_data_from_file("./data/tasks.json")

@app.put("/tasks/replace_data/")
async def replace_data(new_data: List[Task]):
    print('new data is: ' + new_data.__str__() )
    write_task_data_to_file("./data/tasks.json", new_data)
    return {"status": "success", "message": "Task list updated successfully"}

@app.put("/tasks/{task_id}/")
async def update_task(task_id: int, task: Task):
    tasks = read_data_from_file("./data/tasks.json")
    task_to_update = next((t for t in tasks if t["task_id"] == task_id), None)
    if not task_to_update:
        raise HTTPException(status_code=404, detail="Task not found")
    
    sprints = read_data_from_file("./data/sprints.json")

    # Check if the sprint has changed
    old_sprint_id = task_to_update.get("sprint_id")
    new_sprint_id = task.sprint_id

    if old_sprint_id != new_sprint_id:
        # Update the old sprint by removing the task id
        if old_sprint_id:
            old_sprint = next((s for s in sprints if s["sprint_id"] == old_sprint_id), None)
            if old_sprint:
                # Depending on task's status, remove the task_id from appropriate list
                if task_to_update["status"] == "Not started" and task_id in old_sprint["tasksToDo"]:
                    old_sprint["tasksToDo"].remove(task_id)
                elif task_to_update["status"] == "In progress" and task_id in old_sprint["tasksInProgress"]:
                    old_sprint["tasksInProgress"].remove(task_id)
                elif task_id in old_sprint["tasksDone"]:  # Completed
                    old_sprint["tasksDone"].remove(task_id)

        # Update the new sprint by adding the task id to tasksToDo
        if new_sprint_id:
            new_sprint = next((s for s in sprints if s["sprint_id"] == new_sprint_id), None)
            if new_sprint:
                new_sprint["tasksToDo"].append(task_id)
            
        write_data_to_file("./data/sprints.json", sprints)

    
   # Update the task details
    for key, value in task.dict().items():
        if value is not None:  # Only update if the value is provided
            task_to_update[key] = value

    write_data_to_file("./data/tasks.json", tasks)
    
    return {"status": "success", "message": "Task updated successfully"}
    


@app.put("/tasks/{task_id}/assign_to_sprint/{sprint_id}/")
def assign_task_to_sprint(task_id: int, sprint_id: int):
    tasks = read_data_from_file("./data/tasks.json")
    task_to_update = next((t for t in tasks if t["task_id"] == task_id), None)
    
    if not task_to_update:
        raise HTTPException(status_code=404, detail="Task not found")
    
    sprints = read_data_from_file("./data/sprints.json")
    if not any(sprint for sprint in sprints if sprint["sprint_id"] == sprint_id):
        raise HTTPException(status_code=404, detail="Sprint not found")

    old_sprint_id = task_to_update.get("sprint_id")
    if old_sprint_id:
        old_sprint = next((s for s in sprints if s["sprint_id"] == old_sprint_id), None)
        if old_sprint:
            # Depending on task's status, remove the task_id from appropriate list
            if task_to_update["status"] == "Not started":
                old_sprint["tasksToDo"].remove(task_id)
            elif task_to_update["status"] == "In progress":
                old_sprint["tasksInProgress"].remove(task_id)
            else:  # Completed
                old_sprint["tasksDone"].remove(task_id)

    # Add task id to tasksToDo of the new sprint
    new_sprint = next((s for s in sprints if s["sprint_id"] == sprint_id), None)
    if new_sprint:
        new_sprint["tasksToDo"].append(task_id)

    task_to_update["sprint_id"] = sprint_id
    write_data_to_file("./data/sprints.json", sprints)
    write_data_to_file("./data/tasks.json", tasks)
    
    return {"status": "success", "message": "Task assigned to sprint successfully"}

@app.put("/tasks/{task_id}/assign_to_user/{user_id}/")
def assign_task_to_user(task_id: int, user_id: int):
    tasks = read_data_from_file("./data/tasks.json")
    task_to_update = next((t for t in tasks if t["task_id"] == task_id), None)
    
    if not task_to_update:
        raise HTTPException(status_code=404, detail="Task not found")
    
    users = read_data_from_file("./data/users.json")
    if not any(user for user in users if user["user_id"] == user_id):
        raise HTTPException(status_code=404, detail="User not found")
    
    task_to_update["assigned_to"] = user_id
    write_data_to_file("./data/tasks.json", tasks)
    
    return {"status": "success", "message": "Task assigned to user successfully"}

# SPRINTS
@app.post("/sprints/", response_model=Sprint)
def create_sprint(sprint: SprintCreate):
    sprints = read_data_from_file("./data/sprints.json")
    
    # Assigning a new sprint ID
    sprint_id = len(sprints) + 1
    sprint_data = sprint.dict()
    sprint_data["sprint_id"] = sprint_id
    sprint_data["tasksToDo"] = []
    sprint_data["tasksInProgress"] = []
    sprint_data["tasksDone"] = []
    sprints.append(sprint_data)
    write_data_to_file("./data/sprints.json", sprints)
    
    return sprint_data


@app.get("/sprints/", response_model=List[Sprint])
def get_sprints():
    return read_data_from_file("./data/sprints.json")

@app.get("/sprints/user/{user_id}/", response_model=Sprint)
def get_user_sprint(user_id: int):
    users = read_data_from_file("./data/users.json")
    sprint_id = None  # Initialize the variable
    for user in users: 
        if user['user_id'] == user_id:
            if user.get('sprint_id'):
                sprint_id = user['sprint_id']
    if sprint_id:
        sprints = read_data_from_file("./data/sprints.json")
        for sprint in sprints:
            if sprint['sprint_id'] == sprint_id:
                return sprint    
        raise HTTPException(status_code=404, detail="Sprint not found")
    raise HTTPException(status_code=404, detail="User not found")


@app.get("/sprints/{sprint_id}", response_model=Sprint)
def get_sprint(sprint_id: int):
    sprints = read_data_from_file("./data/sprints.json")
    for sprint in sprints:
        if sprint['sprint_id'] == sprint_id:
            print(sprint)
            return sprint
    raise HTTPException(status_code=404, detail="Sprint not found")


@app.put("/sprints/{sprint_id}/")
async def update_sprint(sprint_id: int, sprint: Sprint):
    sprints = read_data_from_file("./data/sprints.json")
    sprint_to_update = next((s for s in sprints if s["sprint_id"] == sprint_id), None)
    if not sprint_to_update:
        raise HTTPException(status_code=404, detail="Sprint not found")
    
    # Update the sprint details
    sprint_to_update.update(sprint.dict())

    write_data_to_file("./data/sprints.json", sprints)
    
    return {"status": "success", "message": "Sprint updated successfully"}


@app.delete("/sprints/{sprint_id}/")
def delete_sprint(sprint_id: int):
    sprints = read_data_from_file("./data/sprints.json")
    sprint_to_delete = next((s for s in sprints if s["sprint_id"] == sprint_id), None)
    
    if not sprint_to_delete:
        raise HTTPException(status_code=404, detail="Sprint not found")

    sprints.remove(sprint_to_delete)
    write_data_to_file("./data/sprints.json", sprints)
    return {"message": "Sprint deleted successfully"}

@app.put("/sprints/{sprint_id}/update_task_order/")
async def update_task_order(sprint_id: int, task_order: SprintUpdate):
    # 1. Fetch the current sprint data
    sprints = read_data_from_file("./data/sprints.json")
    sprint_to_update = next((s for s in sprints if s["sprint_id"] == sprint_id), None)
    
    if not sprint_to_update:
        raise HTTPException(status_code=404, detail="Sprint not found")

    # 2. Update the sprint's task lists
    sprint_to_update["tasksToDo"] = task_order.tasksToDo
    sprint_to_update["tasksInProgress"] = task_order.tasksInProgress
    sprint_to_update["tasksDone"] = task_order.tasksDone

    # 3. Write the updated sprint data back
    write_data_to_file("./data/sprints.json", sprints)

    return {"detail": "Task order updated successfully"}


""" # Burndown chart

# @app.post("/Burndowns/", response_model= Burndown) # Just copying pattern above
def create_burndown(burndown: BurndownCreate):
    burndowns = read_data_from_file("./data/burndowns.json")
    
    # Assigning a new burndown ID
    burndown_id = len(burndowns) + 1
    burndown_data = burndown.dict()
    burndown_data["burndown_id"] = burndown_id
    burndown_data["progress"] = dict
    burndown_data["not_done"] = list
    burndowns.append(burndown_data)
    write_data_to_file("./data/burndowns.json", burndowns)
    
    return burndown_data

def update_burndown(tbd):
    sprints = read_data_from_file("./data/sprints.json")
    sprint_to_update = next((s for s in sprints if s["sprint_id"] == sprint_id), None)
    if not sprint_to_update:
        raise HTTPException(status_code=404, detail="Sprint not found")
    
    # Update the sprint details
    sprint_to_update.update(sprint.dict())

    write_data_to_file("./data/sprints.json", sprints)
    
    return {"status": "success", "message": "Sprint updated successfully"} """