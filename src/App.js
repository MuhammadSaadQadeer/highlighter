import React, { useEffect, useState } from "react";
import { CompactPicker } from "react-color";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./App.css";
import Button from "./components/Button";
import Modal from "./components/Modal";
import { useCrud } from "./hooks/useCrud";
import { useCrudTabs } from "./hooks/useCrudTabs";
import { useGetAsyncDocs } from "./hooks/useGetAsyncDocs";

const Tooltip = (props) => (
  <Popup
    trigger={(open) => (
      <img
        alt="color-picker-icon"
        style={{ width: 20, height: 20 }}
        src={require("./colorpicker.png")}
      />
    )}
    position="right center"
    closeOnDocumentClick
  >
    <CompactPicker
      color={props.color}
      onChangeComplete={props.updateColor}
      colors={[
        "#4D4D4D",
        "#999999",

        "#FCDC00",
        "#DBDF00",
        "#A4DD00",
        "#68CCCA",
        "#73D8FF",
        "#AEA1FF",
        "#FDA1FF",
        "#333333",
        "#808080",
        "#cccccc",
        "#D33115",
        "#E27300",
        "#FCC400",
        "#B0BC00",
        "#68BC00",
        "#16A5A5",
        "#009CE0",
        "#7B64FF",
        "#FA28FF",
        "#000000",
        "#666666",
        "#B3B3B3",
        "#9F0500",
        "#C45100",
        "#FB9E00",
        "#808900",
        "#194D33",
        "#0C797D",
        "#0062B1",
        "#653294",
        "#AB149E",
      ]}
    />
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
  const { addTab, editTab, removeTab } = useCrudTabs();
  const { getLatestDocs, response } = useGetAsyncDocs(getDocPromise);

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

  function handleTabAdd() {
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
    refresh();
  }

  function handleTodoAdd() {
    if (editDoc) {
      editDoc.title = inputValue;
      let temp = (activeTabDoc.doc.todos.filter(
        (item) => item._id === editDoc._id
      )[0].title = inputValue);
      updateTodo(activeTabDoc);
    } else {
      var todo = {
        _id: new Date().toISOString(),
        title: inputValue,
        completed: false,
      };
      activeTabDoc.doc.todos.push(todo);
      addTodo(activeTabDoc.doc);
      refresh();
    }
    refresh();
  }

  function updateColor(color) {
    console.log(color);
    activeTabDoc.doc.color = color.hex;
    editTab(activeTabDoc.doc);
    refresh();
  }

  function refresh() {
    getLatestDocs();
    setInputValue("");
    setEditDoc(null);
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
              <img
                alt="delete-icon"
                className={"action-icon"}
                src={require("./delete.png")}
              />
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
                  alt="done-icon"
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
                  alt="undo-icon"
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
            todos.map((item) => (
              <Tab style={{ backgroundColor: item.doc.color }}>
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>{item.doc.title}</div>

                  <div
                    onClick={() => {
                      removeTab(item.doc);
                      refresh();
                      window.location.reload();
                    }}
                    style={{ paddingLeft: 20 }}
                  >
                    &times;
                  </div>
                </div>
              </Tab>
            ))}
          <Modal trigger={<button className="add-btn-icon"> + </button>}>
            <div className="modal" style={{ width: 500 }}>
              <div className="content">
                <input
                  type="text"
                  id="tab-title"
                  placeholder={"Add Title"}
                  style={{
                    width: 500,
                  }}
                  onChange={(e) => {
                    setTabValue(e.target.value);
                  }}
                />
              </div>

              <Button
                id={"add-tab"}
                onClick={handleTabAdd}
                className="add-btn"
                btnText={editDoc ? "Update Tab" : "Add Tab"}
              />
            </div>
          </Modal>
        </TabList>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: 5 }}>
          {activeTabDoc && (
            <Tooltip color={activeTabDoc.doc.color} updateColor={updateColor} />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80% 20%",
          }}
        >
          {response && activeTabDoc ? (
            <>
              <input
                id="todo-description"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTodoAdd();
                }}
                type="text"
                onChange={(e) => handleChange(e)}
                placeholder={`Add Todo Item to ${activeTabDoc.doc.title}`}
                value={inputValue}
              />
              <div className="btn-container">
                <Button
                  id="add-todo"
                  onClick={handleTodoAdd}
                  className="add-btn"
                  btnText={editDoc ? "Update" : "Add"}
                />
              </div>
            </>
          ) : null}
        </div>
        {todos && todos.length > 0 ? (
          todos.map((item) => {
            return (
              <table
                className="table-container"
                style={{ backgroundColor: item.doc.color }}
              >
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
