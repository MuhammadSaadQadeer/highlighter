import React from "react";



function Button ({text, id,...props}){



    return (
        <button id={id} {...props}>
{text}
        </button>
    )
}

export default Button