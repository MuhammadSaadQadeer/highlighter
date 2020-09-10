import { usePouchDb } from "./usePouchDb";
import { useState } from "react";

export function useCrud() {
  const db = usePouchDb();

  function addTodo(text) {
    var todo = {
      _id: new Date().toISOString(),
      title: text,
      completed: false,
    };
    db.put(todo, function callback(err, result) {
      if (!err) {
        console.log("Successfully posted a todo!");
      }
    });
  }

  function updateTodo(doc) {
    db.put(doc, function callback(err, result) {
      console.log(err, result);
      if (!err) {
        console.log("Successfully updated a todo!");
      }
    });
  }

  function getDocPromise() {
    return db.allDocs({ include_docs: true, descending: true }, (err, doc) => {
      return doc.rows;
    });
  }

  function deleteTodo(todo) {
    db.remove(todo);
  }

  return { addTodo, getDocPromise, deleteTodo, updateTodo };
}
