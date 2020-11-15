import { usePouchDb } from "./usePouchDb";

export function useCrudTabs(dbName) {
  const db = usePouchDb(dbName);

  function addTab(obj) {
    var tab = {
      _id: new Date().toISOString(),
      title: obj.title ? obj.title : "No Title",
      todos: obj.todos,
      color: obj.color,
    };
    db.put(tab, function callback(err, result) {
      if (!err) {
        console.log("Tab added successfully!");
      }
    });
  }

  function removeTab(tab) {
    db.remove(tab);
  }

  function editTab(tab) {
    db.put(tab, function callback(err, result) {
      if (!err) {
        console.log("Tab updated successfully!");
      } else {
        console.log(err);
      }
    });
  }

  function showTabs() {}

  return { addTab, removeTab, editTab, showTabs };
}
