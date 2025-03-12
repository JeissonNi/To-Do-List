let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const filter = document.getElementById("filter");

    //
    filter.addEventListener("change", renderTasks);

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
        updatePendingCount();
        taskInput.value = "";
    }

    // Marcar tarea como completada , eliminarla o editarla
    taskList.addEventListener("click", function(event) {
        const id = Number(event.target.dataset.id);

        if (event.target.classList.contains("delete")) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        } else if (event.target.classList.contains("complete")) {
            tasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            saveTasks();
            renderTasks();
            updatePendingCount(); // 🔄 Actualizar contador
        } else if (event.target.classList.contains("edit")) {
            enableEdit(id);
        }
    });

    

    //Editar tareas
    function enableEdit(id) {
        const task = tasks.find(task => task.id === id);
        if (!task) return;

        const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
        if (!taskElement) return;

        const input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.classList.add("edit-input");

        taskElement.replaceWith(input);
        input.focus();

        input.addEventListener("blur", () => saveEdit(id, input.value, input));
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                saveEdit(id, input.value, input);
            }
        });
    }

    function saveEdit(id, newText, inputElement) {
        newText = newText.trim();
        if (newText === "") {
            renderTasks(); // Evita que quede vacío
            return;
        }

        tasks = tasks.map(task =>
            task.id === id ? { ...task, text: newText } : task
        );

        saveTasks();
        renderTasks();
    }

    // Guardar tareas en LocalStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    //Tareas pendientes
    function updatePendingCount() {
        const pendingCount = tasks.filter(task => !task.completed).length;
        const completedCount = tasks.filter(task => task.completed).length;

        document.getElementById("pendingTasks").textContent = `Tareas pendientes: ${pendingCount}`;
        document.getElementById("completedTasks").textContent = `Tareas terminadas: ${completedCount}`;
    }
    

    // Renderizar tareas
    function renderTasks() {
        taskList.innerHTML = "";
        const filterValue = filter.value;
    
        tasks.forEach(task => {
            if (filterValue === "completed" && !task.completed) return;
            if (filterValue === "pending" && task.completed) return;
    
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">${task.text}</span>
                <div class="task-buttons">
                    <button class="edit" data-id="${task.id}">✏️</button>
                    <button class="delete" data-id="${task.id}">❌</button>
                    <button class="complete" data-id="${task.id}">✔️</button>
                </div>
            `;
            taskList.appendChild(li);
        });
        updatePendingCount(); // 🔄 Actualizar contador
    }
});


/* Inicio modo oscuro */
const toggleThemeBtn = document.getElementById("toggleTheme");

// Cargar la preferencia guardada
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggleThemeBtn.textContent = "☀️";
    }
});

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Guardar la preferencia
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        toggleThemeBtn.textContent = "☀️";
    } else {
        localStorage.setItem("darkMode", "disabled");
        toggleThemeBtn.textContent = "🌙";
    }
});
/* Fin modo oscuro */

/* Inicio funcionalidad exportar e importar JSON */
const exportBtn = document.getElementById("exportTasks");

// Exportar tareas a un archivo JSON
exportBtn.addEventListener("click", () => {
    // Recargar la variable tasks con la versión más reciente del localStorage
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (tasks.length === 0) {
        alert("No hay tareas para exportar.");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "tareas.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
});
/* Fin funcionalidad exportar e importar JSON */