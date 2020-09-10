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
  const [tabIndex, setTabIndex] = useState(0);
  const [activeTabDoc, setActiveTabDoc] = useState(null);
  const [tabs, setTabs] = useState([1, 2, 3]);

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
            todos.length &&
            todos.map((item) => <Tab>{item.doc.title}</Tab>)}
          <Popup trigger={<button className="button"> + </button>} modal nested>
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
                  id={"add-todo"}
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
                  {editDoc ? "Update" : "Add"}
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
              placeholder={`Add Todo Item to ${activeTabDoc.doc.title}`}
              value={inputValue}
            />
          ) : null}

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
              <TabPanel>
                {item.doc.todos &&
                  item.doc.todos.map((item) => {
                    return <div>{item}</div>;
                  })}
              </TabPanel>
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
