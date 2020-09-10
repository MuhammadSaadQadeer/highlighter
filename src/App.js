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
  const { addTodo, getDocPromise, deleteTodo, updateTodo } = useCrud();
  const { addTab } = useCrudTabs();
  const [todos, setTodos] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tabValue, setTabValue] = useState("");
  const [editDoc, setEditDoc] = useState(null);
  const [tabs, setTabs] = useState([1, 2, 3]);

  const { getLatestDocs, response } = useGetAsyncDocs(getDocPromise);
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
                getLatestDocs();
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
                  getLatestDocs();
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
                  getLatestDocs();
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

  useEffect(() => {
    getLatestDocs();
  }, []);

  useEffect(() => {
    if (response) setTodos(response.rows);
  }, [response]);
  function handleChange(e) {
    setInputValue(e.target.value);
  }

  return (
    <div className="main-container">
      <Tabs>
        <TabList>
          {todos &&
            todos.length &&
            todos.map((item) => {
              return (
                <>
                  {console.log(item)}
                  <Tab>{item.doc.title}</Tab>
                </>
              );
            })}
          <Popup trigger={<button className="button"> + </button>} modal nested>
            {(close) => (
              <div className="modal">
                <button className="close" onClick={close}>
                  &times;
                </button>
                <div className="header"> Add Tab Name </div>
                <div className="content">
                  <input
                    type="text"
                    onChange={(e) => {
                      setTabValue(e.target.value);
                    }}
                  />
                </div>
              </div>
            )}
          </Popup>
        </TabList>

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
                getLatestDocs();
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

                getLatestDocs();
                setInputValue("");
                setEditDoc(null);
              }}
              className="add-btn"
            >
              {editDoc ? "Update" : "Add"}
            </button>
          </div>
        </div>
        {todos &&
          todos.length &&
          todos.map((item) => {
            return (
              <>
                <TabPanel>
                  {console.log("hjere", item)}
                  {item.doc.todos &&
                    item.doc.todos.map((item) => {
                      return (
                        <div>
                          {console.log("her", item)}
                          {item}
                        </div>
                      );
                    })}
                </TabPanel>
              </>
            );
          })}
      </Tabs>

      {/* {tabs.map((no) => {
          return (
            <TodoContext.Provider value={{ todos }}>
              <TabList>
                <Tab>{no}</Tab>
              </TabList>
              
                <table className="table-container">
                <TabPanel>
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
                  </TabPanel>
                </table>
              
            </TodoContext.Provider>
          );
        })} */}
    </div>
  );
}

export default App;
