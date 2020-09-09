import React, { useState, useEffect } from "react";
import "./App.css";
import { TodoContext } from "./ctx/TodoCtx";
import { useCrud } from "./hooks/useCrud";
import { usePouchDb } from "./hooks/usePouchDb";

function App() {
  const [addTodo, showTodos, deleteTodo, updateTodo] = useCrud();
  const [todos, setTodos] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [editDoc, setEditDoc] = useState(null);
  const db = usePouchDb();

  const Item = ({ doc }) => {
    return (
      <>
        <tr
          onDoubleClick={() => {
            setEditDoc(doc);
            setInputValue(doc.title);
          }}
        >
          <td style={{ width: "100%" }}>
            <p
              className={`todo-item`}
              style={{
                textDecoration: doc.completed ? "line-through" : "",
              }}
            >
              {doc.title}
            </p>
          </td>
          <td>
            <span
              style={{ marginRight: 10 }}
              onClick={() => {
                deleteTodo(doc);
                updateTodos();
              }}
            >
              <img className={"action-icon"} src={require("./delete.png")} />
            </span>
          </td>
          <td>
            {!doc.completed ? (
              <span
                style={{ marginRight: 10 }}
                onClick={() => {
                  doc.completed = true;
                  db.put(doc);
                  updateTodos();
                }}
              >
                <img className={"action-icon"} src={require("./done_2.png")} />
              </span>
            ) : (
              <span
                style={{ marginRight: 10 }}
                onClick={() => {
                  doc.completed = false;
                  db.put(doc);
                  updateTodos();
                }}
              >
                <img className={"action-icon"} src={require("./undo.png")} />
              </span>
            )}
          </td>
        </tr>
      </>
    );
  };

  function updateTodos() {
    db.allDocs({ include_docs: true, descending: true }, (err, doc) => {
      setTodos(doc.rows);
    });
  }

  useEffect(() => {
    updateTodos();
  }, []);

  useEffect(() => {}, [todos]);
  function handleChange(e) {
    setInputValue(e.target.value);
  }

  return (
    <div className="main-container">
      <div style={{ display: "grid", gridTemplateColumns: "80% 20%" }}>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (editDoc) {
                editDoc.title = inputValue;
                updateTodo(editDoc);
              } else {
                addTodo(inputValue);
              }
              updateTodos();
              setInputValue("");
              setEditDoc(null);
            }
          }}
          type="text"
          onChange={(e) => handleChange(e)}
          placeholder={"Add Todo Item..."}
          value={inputValue}
        />
        <div className="btn-container">
          <button
            id={"add-todo"}
            onClick={() => {
              if (editDoc) {
                editDoc.title = inputValue;
                updateTodo(editDoc);
              } else {
                addTodo(inputValue);
              }

              updateTodos();
              setInputValue("");
              setEditDoc(null);
            }}
            className="add-btn"
          >
            {editDoc ? "Update" : "Add"}
          </button>
        </div>
      </div>
      <hr />
      <TodoContext.Provider value={{ todos, updateTodos: () => {} }}>
        <table className="table-container">
          {todos && todos.length ? (
            todos.map((item) => <Item {...item} />)
          ) : (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "gray",
              }}
            >
              You have no todos
            </span>
          )}
        </table>
      </TodoContext.Provider>
    </div>
  );
}

export default App;
