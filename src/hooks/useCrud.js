import { usePouchDb } from "./usePouchDb";
import { useState } from "react";

export function useCrud() {
  const db = usePouchDb();
  const [todos, setTodos] = useState([])

  function addTodo(text) {
    var todo = {
      _id: new Date().toISOString(),
      title: text,
      completed: false,
    };
    db.put(todo, function callback(err, result) {
      if (!err) {
        console.log("Successfully posted a todo!");
        showTodos();
      }
    });
  }

  async function showTodos() {
   const result =  await db.allDocs(
      { include_docs: true, descending: true },
      (err, doc) => {
        setTodos(doc.rows)
        return doc.rows
      }
    );
    return result;  
  }

  function deleteTodo(todo) {
    console.log('BAZ', todo)
    db.remove(todo);
   // showTodos();
  }

  return [addTodo, showTodos, deleteTodo, todos];
}
