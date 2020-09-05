import React from "react";

function Button({ text, id, ...props }) {
  return (
    <button
      id={id}
      {...props}
      style={{
        borderRadius: 4,
        backgroundColor: "#2ec1ac",
        padding: 8,
        color: "white",
        border: "none",
      }}
    >
      {text}
    </button>
  );
}

export default Button;
