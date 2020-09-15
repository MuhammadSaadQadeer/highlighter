import { usePouchDb } from "./usePouchDb";

export function useCrudTabs() {
  const db = usePouchDb();

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

  function removeTab() {}

  function editTab() {}

  function showTabs() {}

  return { addTab, removeTab, editTab, showTabs };
}
