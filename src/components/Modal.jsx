import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function Modal(props) {
  const { trigger } = props;
  return (
    <Popup trigger={trigger} modal nested>
      {(close) => (
        <div className="modal" style={{ width: 500 }}>
          <button className="close" onClick={close}>
            &times;
          </button>
          {props.children}
        </div>
      )}
    </Popup>
  );
}

export default Modal;
