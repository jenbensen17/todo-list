import { v4 as uuidv4 } from "uuid";

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");

class Task {
    _id: string;
    _title: string;
    _completed: boolean;
    _createdAt: Date;

    constructor(id: any, title: string, completed: boolean, createdAt: Date) {
        this._id = id;
        this._title = title;
        this._completed = completed;
        this._createdAt = createdAt;
    }

    get id() {
        return this._id;
    }
    get title() {
        return this._title;
    }
    get completed() {
        return this._completed;
    }
    get createdAt() {
        return this._createdAt;
    }

    set completed(status: boolean) {
        this._completed = status;
    }
}

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

form?.addEventListener("submit", e => {
    e.preventDefault();

    if (!input || input.value === "") {
        return;
    }

    const newTask: Task = new Task(uuidv4(), input.value, false, new Date());
    tasks.push(newTask);
    saveTasks();

    addListItem(newTask);
    input.value = "";
});

function addListItem(task: Task) {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks(); // Save tasks after completion status change
    });

    label.append(checkbox, task.title);
    item.append(label);
    list?.append(item);
}

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        createdAt: task.createdAt.getTime() // Convert Date object to timestamp
    }))));
}

function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS");
    if (!taskJSON) return []; // Handle case where local storage doesn't have tasks
    try {
        const tasksData = JSON.parse(taskJSON);
        return tasksData.map((taskData: any) => new Task(
            taskData.id,
            taskData.title,
            taskData.completed,
            new Date(taskData.createdAt)
        ));
    } catch (error) {
        console.error("Error parsing tasks from local storage:", error);
        return [];
    }
}
