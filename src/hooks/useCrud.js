import { usePouchDb } from "./usePouchDb";

export function useCrud() {
  const { db } = usePouchDb();

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

  function showTodos() {
    db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
      console.log(doc.rows);
      setTodos(doc.rows);
    });
  }

  function deleteTodo(todo) {
    console.log("tod", todo);
    db.remove(todo.item);
    showTodos();
  }


}
