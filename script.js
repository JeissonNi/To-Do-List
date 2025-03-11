document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    // Cargar tareas guardadas
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();

    // Agregar tarea
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = "";
    }

    // Marcar tarea como completada o eliminarla
    taskList.addEventListener("click", function(event) {
        const id = Number(event.target.dataset.id);
        if (event.target.classList.contains("delete")) {
            tasks = tasks.filter(task => task.id !== id);
        } else if (event.target.classList.contains("task-item")) {
            tasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
        }
        saveTasks();
        renderTasks();
    });

    // Guardar tareas en LocalStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Renderizar tareas
    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">${task.text}</span>
                <button class="delete" data-id="${task.id}">❌</button>
            `;
            taskList.appendChild(li);
        });
    }
});