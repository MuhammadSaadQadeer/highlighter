import React, { useState, useEffect } from "react";
import "./App.css";
import { TodoContext } from "./ctx/TodoCtx";
import { useCrud } from "./hooks/useCrud";
import { useCrudTabs } from "./hooks/useCrudTabs";
import { usePouchDb } from "./hooks/usePouchDb";
import { useGetAsyncDocs } from "./hooks/useGetAsyncDocs";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const renderPopup = () => (
  <Popup trigger={<button> Trigger</button>} position="right center">
    <div>Popup content here !!</div>
  </Popup>
);

function App() {
  const [todos, setTodos] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tabValue, setTabValue] = useState("");
  const [editDoc, setEditDoc] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [activeTabDoc, setActiveTabDoc] = useState(null);

  const { addTodo, getDocPromise, deleteTodo, updateTodo } = useCrud();
  const { addTab } = useCrudTabs();
  const { getLatestDocs, response } = useGetAsyncDocs(getDocPromise);
  const db = usePouchDb();

  useEffect(() => {
    getLatestDocs();
  }, []);

  useEffect(() => {
    if (response) {
      setTodos(response.rows);
      setActiveTabDoc(response.rows[tabIndex]);
    }
  }, [response, activeTabDoc]);
  function handleChange(e) {
    setInputValue(e.target.value);
  }

  const Item = ({ completed, title, _id, doc }) => {
    return (
      <>
        <tr
          onDoubleClick={() => {
            setEditDoc({ _id, title });
            setInputValue(title);
          }}
        >
          <td style={{ width: "100%" }}>
            <p
              className={`todo-item`}
              style={{
                textDecoration: completed ? "line-through" : "",
              }}
            >
              {title}
            </p>
          </td>
          <td>
            <span
              style={{ marginRight: 10 }}
              onClick={() => {
                doc.todos = doc.todos.filter((item) => item._id !== _id);
                updateTodo(doc);
                getLatestDocs();
              }}
            >
              <img className={"action-icon"} src={require("./delete.png")} />
            </span>
          </td>
          <td>
            {!completed ? (
              <span
                style={{ marginRight: 10 }}
                onClick={() => {
                  doc.todos.filter(
                    (item) => item._id === _id
                  )[0].completed = true;
                  updateTodo(doc);
                  getLatestDocs();
                }}
              >
                <img
                  alt="done"
                  className={"action-icon"}
                  src={require("./done_2.png")}
                />
              </span>
            ) : (
              <span
                style={{ marginRight: 10 }}
                onClick={() => {
                  doc.todos.filter(
                    (item) => item._id === _id
                  )[0].completed = false;
                  updateTodo(doc);
                  getLatestDocs();
                }}
              >
                <img
                  alt="undo"
                  className={"action-icon"}
                  src={require("./undo.png")}
                />
              </span>
            )}
          </td>
        </tr>
      </>
    );
  };

  return (
    <div className="main-container">
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(tabIndex) => {
          setTabIndex(tabIndex);
          setActiveTabDoc(response.rows[tabIndex]);
        }}
      >
        <TabList>
          {todos &&
            todos.length > 0 &&
            todos.map((item) => <Tab>{item.doc.title}</Tab>)}
          <Popup
            trigger={<button className="add-btn-icon"> + </button>}
            modal
            nested
          >
            {(close) => (
              <div className="modal" style={{ width: 500 }}>
                <button className="close" onClick={close}>
                  &times;
                </button>
                <div className="content">
                  <input
                    type="text"
                    placeholder={"Add Title"}
                    style={{
                      width: 500,
                    }}
                    onChange={(e) => {
                      setTabValue(e.target.value);
                    }}
                  />
                </div>

                <button
                  id={"add-tab"}
                  onClick={() => {
                    if (editDoc) {
                      editDoc.title = inputValue;
                      updateTodo(editDoc);
                    } else {
                      let obj = {
                        title: tabValue,
                        todos: [],
                        color: "orange",
                      };
                      addTab(obj);
                    }

                    getLatestDocs();
                    setTabValue("");
                    setEditDoc(null);
                    close();
                  }}
                  className="add-btn"
                >
                  {editDoc ? "Update Tab" : "Add Tab"}
                </button>
              </div>
            )}
          </Popup>
        </TabList>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80% 20%",
          }}
        >
          {response && activeTabDoc ? (
            <>
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (editDoc) {
                      editDoc.title = inputValue;
                      let temp = (activeTabDoc.doc.todos.filter(
                        (item) => item._id === editDoc._id
                      )[0].title = inputValue);
                      console.log("BAZ", temp);
                      updateTodo(activeTabDoc);
                    } else {
                      var todo = {
                        _id: new Date().toISOString(),
                        title: inputValue,
                        completed: false,
                      };
                      activeTabDoc.doc.todos.push(todo);
                      addTodo(activeTabDoc.doc);
                    }
                    getLatestDocs();
                    setInputValue("");
                    setEditDoc(null);
                  }
                }}
                type="text"
                onChange={(e) => handleChange(e)}
                placeholder={`Add Todo Item to ${activeTabDoc.doc.title}`}
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
                      var todo = {
                        _id: new Date().toISOString(),
                        title: inputValue,
                        completed: false,
                      };
                      let currDoc = activeTabDoc;
                      currDoc.doc.todos.push(todo);
                      updateTodo(currDoc);
                    }

                    getLatestDocs();
                    setInputValue("");
                    setEditDoc(null);
                  }}
                  className="add-btn"
                >
                  {editDoc ? "Update" : "Add"}
                </button>
              </div>
            </>
          ) : null}
        </div>
        {todos && todos.length > 0 ? (
          todos.map((item) => {
            return (
              <table className="table-container">
                <TabPanel>
                  {item.doc.todos &&
                    item.doc.todos.map((item) => {
                      return <Item {...item} doc={activeTabDoc.doc} />;
                    })}
                </TabPanel>
              </table>
            );
          })
        ) : (
          <span
            style={{
              color: "gray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Add Tabs and Todos
          </span>
        )}
      </Tabs>
    </div>
  );
}

export default App;
