const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addbutton = document.getElementById("add-button");
const editbutton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("deleteAll");
const filterButtons = document.querySelectorAll(".liter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const saveTolocalstorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const displayTodos = () => {
  todosBody.innerHTML = "";
  if (!todos.length) {
    todosBody.innerHTML = "<tr><td colspan = '4'> No Task Found</td></tr>";
    return;
  }
  todos.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
          <td>${todo.task}</td>
            <td>${todo.date || "NO date"}</td>
            <td>${todo.completed ? "Completed" : "pending"}</td>
            <td>
                <button  onclick="editHandler('${todo.id}')">Edit</button>
                <button onclick="doHandler('${todo.id}')">
                ${todo.completed ? "Undo" : "Do"}</button>
                <button onclick="deleteHandler('${todo.id}')">Delete</button>
          </td>
    </tr> `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveTolocalstorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    console.log(todos);
    showAlert("todo added sucssesfuly ", "success");
  } else {
    showAlert("Please enter a todo! ", "error");
  }
};

let deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveTolocalstorage();
    displayTodos();
    showAlert(" All todos cleared ", "success");
  } else {
    showAlert("No todos to clear", "error");
  }
};
const deleteHandler = (id) => { 
  todos = todos.filter(todo => todo.id !== id);
  saveTolocalstorage();
  displayTodos();
  showAlert("Todo deleted successfully", "success");
}

const doHandler = (id) => {
  // todos = todos.map(todo => {
  //   if (todo.id === id) {
  //     return { ...todo, completed: !todo.completed };
  //   }
  //   return todo;
  // });
  const todo = todos.find(todo => todo.id === id);
  todo.completed = !todo.completed;
  saveTolocalstorage();
  displayTodos();
  showAlert("Todo status updated successfully", "success");
};

const editHandler = (id) => {
  const todo = todos.find(todo => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addbutton.style.display = "none";
  editbutton.style.display = "inline-block";
  editbutton.onclick = () => {
    todo.task = taskInput.value;
    todo.date = dateInput.value;
    saveTolocalstorage();
    displayTodos();
    showAlert("Todo edited successfully", "success");
    taskInput.value = "";
    dateInput.value = "";
    addbutton.style.display = "inline-block";
    editbutton.style.display = "none";
  };
};



 

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.innerText.toLowerCase();
    let filteredTodos = [];
    if (filter === "all") {
      filteredTodos = todos;
    } else if (filter === "pending") {
      filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === "completed") {
      filteredTodos = todos.filter(todo => todo.completed);
    }
    todosBody.innerHTML = "";
    if (!filteredTodos.length) {
      todosBody.innerHTML = "<tr><td colspan='4'>No Task Found</td></tr>";
      return;
    }
    filteredTodos.forEach(todo => {
      todosBody.innerHTML += `
      <tr>
            <td>${todo.task}</td>
              <td>${todo.date || "NO date"}</td>
              <td>${todo.completed ? "Completed" : "pending"}</td>
              <td>
                  <button  onclick="editHandler('${todo.id}')">Edit</button>
                  <button onclick="doHandler('${todo.id}')">
                  ${todo.completed ? "Undo" : "Do"}</button>
                  <button onclick="deleteHandler('${todo.id}')">Delete</button>
            </td>
      </tr> `;
    });
  });
});

window.addEventListener("load", displayTodos);
addbutton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
