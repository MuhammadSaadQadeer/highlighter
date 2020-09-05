import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "./components/Button";
import { TodoContext } from "./ctx/TodoCtx";
import { useCrud } from "./hooks/useCrud";
import { usePouchDb } from "./hooks/usePouchDb";

function App() {
  const [addTodo, showTodos, deleteTodo] = useCrud();
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const db = usePouchDb()

  const Item = (item) => {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "80% 10%" }}>
        <div style={{ overflowWrap: "anywhere" }}>{item.doc.title}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
          }}
        >
          <Button text={"Done"} id={"done"} />
          <Button
            onClick={(item) => deleteTodo(item)}
            text={"Delete"}
            id={"delete"}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {

    
      db.allDocs(
        { include_docs: true, descending: true },
        (err, doc) => {
          console.log('doc', doc.rows)
          setTodos(doc.rows)
          console.log('FOO', todos)
        }
      );
  
  }, [todos]);
  function handleChange(e) {
    console.log(e.target.value);
    setInputValue(e.target.value);
  }

  return (
    <div style={{ margin: 10, padding: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "80% 10%" }}>
        <input
          key={"uuid"}
          type="text"
          onChange={(e) => handleChange(e)}
          value={inputValue}
          style={{ width: "100%", height: 30 }}
        />
        <div style={{ display: "flex", alignItems: "center", marginLeft: 20 }}>
          <Button onClick={() => addTodo(inputValue)} text={"Add"} />
        </div>
      </div>
      <TodoContext.Provider value={{ todos, updateTodos:()=>{} }}>
        <div>
          {/* <div style={{ margin: 10, width: "100%" }}>
            {todos && todos.rows.map((item) => {
              return (
                <div style={{ padding: 10 }}>
                  <Item item={item} />
                </div>
              );
            })}
          </div> */}
        </div>
      </TodoContext.Provider>
    </div>
  );
}

export default App;
