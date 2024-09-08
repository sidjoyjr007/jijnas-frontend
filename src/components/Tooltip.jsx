import React, { useState } from "react";

const Tooltip = ({ message, children, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleTooltip = () => {
    setIsVisible(!isVisible);
  };

  let positionClass = "";
  switch (position) {
    case "top":
      positionClass = "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      break;
    case "bottom":
      positionClass = "top-full left-1/2 transform -translate-x-1/2 mt-2";
      break;
    case "left":
      positionClass = "right-full top-1/2 transform -translate-y-1/2 mr-2";
      break;
    case "right":
      positionClass = "left-full top-1/2 transform -translate-y-1/2 ml-2";
      break;
    default:
      positionClass = "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
  }

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={toggleTooltip}
      onMouseLeave={toggleTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${positionClass} bg-gray-700 text-white text-sm px-2 py-2 rounded shadow-md z-10 max-w-md min-w-48 break-words`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
