let newTodo = document.getElementById("add-todo");
let search = document.getElementById("search-todo");
let close = document.querySelectorAll(".fas");
let root = document.querySelector(".root");

let store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
let todos = store.getState();

function reducer(prevState = [], action) {
  switch (action.type) {
    case "addTodo":
      return [
        ...prevState,
        {
          title: action.title,
          isDone: false,
          id: Date.now(),
        },
      ];
    case "removeTodo":
      let newState = [...prevState];
      newState.splice(
        prevState.findIndex((todo) => todo.id == action.id),
        1
      );
      return newState;

    case "toggleIsDone":
      let todo = prevState.find((todo) => todo.id == action.id);
      todo.isDone = !todo.isDone;
      return prevState;
    default:
      return prevState;
  }
}

newTodo.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && event.target.value) {
    store.dispatch({
      type: "addTodo",
      title: event.target.value,
    });
    event.target.value = "";
  }
});

search.addEventListener("keyup", (event) => {
  let searchQuery = store
    .getState()
    .filter((todo) => todo.title.includes(event.target.value));
  createUI(searchQuery);
  if (event.key === "Enter") {
    event.target.value = "";
  }
});

store.subscribe(() => {
  todos = store.getState();
  createUI(todos);
});

function createUI(data) {
  root.innerHTML = "";
  data.forEach((todo) => {
    let li = document.createElement("li");
    let p = document.createElement("p");
    let i = document.createElement("i");
    i.classList.add("fas");
    i.classList.add("fa-xmark");
    i.setAttribute("data-id", todo.id);
    i.addEventListener("click", (event) => {
      store.dispatch({
        type: "removeTodo",
        id: event.target.dataset.id,
      });
    });
    if (todo.isDone) {
      p.classList.add("completed");
    }

    let input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("data-id", todo.id);
    input.addEventListener("click", (event) => {
      store.dispatch({
        type: "toggleIsDone",
        id: event.target.dataset.id,
      });
    });

    p.innerText = todo.title;
    input.checked = todo.isDone;
    li.append(input, p, i);
    root.append(li);
  });
}
