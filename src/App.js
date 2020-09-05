import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "./components/Button";
import { TodoContext } from "./ctx/TodoCtx";
import { useCrud } from "./hooks/useCrud";
import { usePouchDb } from "./hooks/usePouchDb";

function App() {
  const [addTodo, showTodos, deleteTodo] = useCrud();
  const [todos, setTodos] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const db = usePouchDb();

  const Item = ({ doc }) => {
    return (
      <>
        <tr>
          <td>
            {console.log(doc)}
            <div style={{ display: "grid", gridTemplateColumns: "80% 20%" }}>
              <div style={{ overflowWrap: "anywhere" }}>{doc.title}</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "flex-start",
                  marginLeft: 10,
                }}
              ></div>
            </div>
          </td>
          <td>
            <Button text={"Done"} id={"done"} />
          </td>
          <td>
            <Button
              onClick={() => {deleteTodo(doc);updateTodos();}}
              text={"Delete"}
              id={"delete"}
            />
          </td>
        </tr>
      </>
    );
  };


  function updateTodos(){
    db.allDocs({ include_docs: true, descending: true }, (err, doc) => {
      setTodos(doc.rows);
    });
  }

  useEffect(() => {
    updateTodos();
  }, []);

  

  useEffect(() => {
  }, [todos]);
  function handleChange(e) {
    setInputValue(e.target.value);
  }

  return (
    <div
      style={{
        width: 500,
        height: 500,
        margin: 5,
        padding: 5,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "80% 20%" }}>
        <input
          type="text"
          onChange={(e) => handleChange(e)}
          placeholder={"Add Todo Item..."}
          value={inputValue}
          style={{
            width: "100%",
            height: 25,
            paddingLeft: 4,
            paddingRight: 4,
            outline: "none",
            borderRadius: 4,
            borderColor:"lightgray"
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: 20,
            height: 30,
          }}
        >
          <button
            id={"add-todo"}
            onClick={() => {addTodo(inputValue);updateTodos();setInputValue("")}}
            style={{
              borderRadius: 4,
              backgroundColor: "#2ec1ac",
              padding: 8,
              color: "white",
              border: "none",
              width: 100,
            }}
          >
            Add
          </button>
        </div>
      </div>
      <hr />
      <TodoContext.Provider value={{ todos, updateTodos: () => {} }}>
        <table style={{width:500, borderCollapse: "separate", borderSpacing: "0 10px" , border:"1px solid", borderRadius:4,padding:7, borderColor:"lightgray"}}>
          {todos && todos.length ? todos.map((item) => <Item {...item} />): <span style={{display:"flex", justifyContent:"center", alignItems:"center", color:"gray"}}>You have no todos</span>}
        </table>
      </TodoContext.Provider>
    </div>
  );
}

export default App;
