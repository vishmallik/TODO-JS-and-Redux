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
          id: action.id,
        },
      ];
    case "removeTodo":
      let newState = [...prevState];
      newState.splice(action.id, 1);
      return newState;
    case "toggleIsDone":
      let todo = prevState.at(action.id);
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
  data.forEach((todo, index) => {
    let li = document.createElement("li");
    let p = document.createElement("p");
    let i = document.createElement("i");
    i.classList.add("fas");
    i.classList.add("fa-xmark");
    i.addEventListener("click", () => {
      store.dispatch({
        type: "removeTodo",
        id: index,
      });
    });
    if (todo.isDone) {
      p.classList.add("completed");
    }

    let input = document.createElement("input");
    input.type = "checkbox";
    input.addEventListener("click", () => {
      store.dispatch({
        type: "toggleIsDone",
        id: index,
      });
    });

    p.innerText = todo.title;
    input.checked = todo.isDone;
    li.append(input, p, i);
    root.append(li);
  });
}
