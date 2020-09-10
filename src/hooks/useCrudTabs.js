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

  function getTabPromise() {
    return db.allDocs({ include_docs: true, descending: true }, (err, doc) => {
      console.log("doc", doc.rows);
      return doc.rows;
    });
  }

  return { addTab, removeTab, editTab, showTabs };
}
