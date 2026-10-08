// ================== TODO LIST ==================

const PRIORITIES = ["high", "medium", "low"];
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
let nextId = 1;

function createTask(title, isComplete = false, priority = "medium") {
    return { id: nextId++, title, isComplete, priority };
}

const todoList = [
    createTask("Go to school", false),
    createTask("Listen to music", true),
    createTask("Looking for a work", false),
];

// ---------- helping funcs ----------

function sortTodos() {
    todoList.sort(
        (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.id - b.id
    );
}

function findTask(id) {
    return todoList.find((task) => task.id === id);
}

sortTodos();

// ---------- features ----------

function addTodo(text, priority = "medium") {
    if (!text || !text.trim()) {
        console.log("Task title can't be empty.");
        return null;
    }
    if (!PRIORITIES.includes(priority)) {
        console.log(`Priority must be one of: ${PRIORITIES.join(", ")}`);
        return null;
    }
    const task = createTask(text.trim(), false, priority);
    todoList.push(task);
    sortTodos();
    console.log(`Task added! (id: ${task.id})`);
    return task.id;
}

function deleteTodo(id) {
    const index = todoList.findIndex((task) => task.id === id);
    if (index === -1) {
        console.log(`Task with id ${id} not found.`);
        return false;
    }
    todoList.splice(index, 1);
    console.log(`Task ${id} deleted.`);
    return true;
}

function markAsDone(id, done = true) {
    const task = findTask(id);
    if (!task) {
        console.log(`Task with id ${id} not found.`);
        return false;
    }
    task.isComplete = done;
    console.log(`Task ${id} marked as ${done ? "done" : "NOT done"}.`);
    return true;
}

function changePriorityTask(id, priority) {
    if (!PRIORITIES.includes(priority)) {
        console.log(`Priority must be one of: ${PRIORITIES.join(", ")}`);
        return false;
    }
    const task = findTask(id);
    if (!task) {
        console.log(`Task with id ${id} not found.`);
        return false;
    }
    task.priority = priority;
    sortTodos();
    console.log(`Task ${id} priority set to "${priority}".`);
    return true;
}

function editTask(id, newTitle) {
    if (!newTitle || !newTitle.trim()) {
        console.log("New title can't be empty.");
        return false;
    }
    const task = findTask(id);
    if (!task) {
        console.log(`Task with id ${id} not found.`);
        return false;
    }
    task.title = newTitle.trim();
    console.log(`Task ${id} renamed to "${task.title}".`);
    return true;
}

// ---- Test ----
console.log(todoList);

const bookId = addTodo("Read a book", "high");
markAsDone(1);                      // Go to school -> done
markAsDone(2, false);               // Listen to music -> NOT done
changePriorityTask(3, "high");
editTask(3, "Look for a job");
deleteTodo(bookId);
deleteTodo(999);                    // not found

console.log(todoList);