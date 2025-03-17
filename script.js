class Task {
    constructor(id, title, description, priority, category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.category = category;
        this.completed = false;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasks();
    }

    addTask(title, description, priority, category) {
        if (!title.trim()) {
            alert("Task title cannot be empty");
            return;
        }
        const id = Date.now();
        const task = new Task(id, title, description, priority, category);
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        if (priority === "high") this.showNotification("High-priority task added!");
    }

    updateTask(id, newTitle, newDescription, newPriority, newCategory) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.title = newTitle;
            task.description = newDescription;
            task.priority = newPriority;
            task.category = newCategory;
            this.saveTasks();
            this.renderTasks();
        }
    }

    showEditForm(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const taskElement = document.getElementById(`task-${id}`);
        taskElement.innerHTML = `
            <input type="text" id="edit-title-${id}" value="${task.title}" placeholder="Enter title" required>
            <textarea id="edit-description-${id}" placeholder="Enter description" required>${task.description}</textarea>
            <select id="edit-priority-${id}">
                <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
                <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
                <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
            </select>
            <select id="edit-category-${id}">
                <option value="Personal" ${task.category === "Personal" ? "selected" : ""}>Personal</option>
                <option value="Work" ${task.category === "Work" ? "selected" : ""}>Work</option>
                <option value="Urgent" ${task.category === "Urgent" ? "selected" : ""}>Urgent</option>
            </select>
            <button onclick="taskManager.saveEdit(${id})">Save</button>
            <button onclick="taskManager.renderTasks()">Cancel</button>
        `;
    }

    saveEdit(id) {
        const newTitle = document.getElementById(`edit-title-${id}`).value.trim();
        const newDescription = document.getElementById(`edit-description-${id}`).value.trim();
        const newPriority = document.getElementById(`edit-priority-${id}`).value;
        const newCategory = document.getElementById(`edit-category-${id}`).value;

        // Validation Check: Prevent empty title or description
        if (!newTitle) {
            document.getElementById(`edit-title-${id}`).style.border = "1px solid red";
            alert("Title is a required field")
            return;
        }
        if (!newDescription) {
            document.getElementById(`edit-description-${id}`).style.border = "1px solid red";
            alert("Description is a required field")
            return;
        }

        this.updateTask(id, newTitle, newDescription, newPriority, newCategory);
    }


    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    filterAndSearchTasks() {
        const searchTerm = document.getElementById("search").value.toLowerCase();
        const selectedCategory = document.getElementById("filterCategory").value;
    
        // Filter by search term and category
        const filteredTasks = this.tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        this.renderFilteredTasks(filteredTasks);
    }
    
    renderFilteredTasks(filteredTasks) {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = "";
    
        if (filteredTasks.length === 0) {
            //Show "No tasks found" if the list is empty
            taskList.innerHTML = `<div class="no-tasks">No tasks found</div>`;
            return;
        }
    
        filteredTasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.className = `task-item ${task.priority} ${task.completed ? "completed" : ""}`;
            taskItem.id = `task-${task.id}`;
            taskItem.innerHTML = `
                <h3>${task.title} (${task.priority})</h3>
                <p>${task.description}</p>
                <span>Category: ${task.category}</span>
                <div class="actions">
                    <button onclick="taskManager.toggleTaskCompletion(${task.id})">${task.completed ? "Undo" : "Complete"}</button>
                    <button onclick="taskManager.deleteTask(${task.id})">Delete</button>
                    <button onclick="taskManager.showEditForm(${task.id})">Edit</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    toggleTaskCompletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggleComplete();
            this.saveTasks();
            this.renderTasks();
        }
    }

    searchTasks(query) {
        return this.tasks.filter(task => task.title.includes(query) || task.description.includes(query));
    }

    showNotification(message) {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.style.visibility = "visible";
        setTimeout(() => notification.style.visibility = "hidden", 3000);
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        this.tasks = storedTasks.map(task => new Task(task.id, task.title, task.description, task.priority, task.category));
        this.renderTasks();
    }
    
    renderTasks() {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = "";
        this.tasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.className = `task-item ${task.priority} ${task.completed ? "completed" : ""}`;
            taskItem.id = `task-${task.id}`;
            taskItem.innerHTML = `
                <h3>${task.title} (${task.priority})</h3>
                <p>${task.description}</p>
                <span>Category: ${task.category}</span>
                <div class="actions">
                    <button onclick="taskManager.toggleTaskCompletion(${task.id})">${task.completed ? "Undo" : "Complete"}</button>
                    <button onclick="taskManager.deleteTask(${task.id})">Delete</button>
                    <button onclick="taskManager.showEditForm(${task.id})">Edit</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }
}

const taskManager = new TaskManager();

// Theme Toggle Functionality
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// Load User's Preferred Theme from Local Storage
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
});

document.getElementById("task-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category").value;
    taskManager.addTask(title, description, priority, category);
    this.reset();
});

// Search Task Event

document.getElementById("search").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();
    taskManager.renderTasks(taskManager.searchTasks(searchTerm));
});

// Ensure event listeners are added for both search input and category dropdown
document.getElementById("search").addEventListener("input", () => taskManager.filterAndSearchTasks());
document.getElementById("filterCategory").addEventListener("change", () => taskManager.filterAndSearchTasks());