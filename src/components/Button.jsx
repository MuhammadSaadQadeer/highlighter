import React from "react";

function Button(props) {
  const { btnText } = props;
  return <button {...props}>{btnText}</button>;
}

export default Button;
