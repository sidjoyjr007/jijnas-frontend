import { useState } from "react";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
const Option = ({
  option,
  optionId,
  questionId,
  rightAnswers = [],
  onOptionSelect,
  isSelectable = true,
  isSelected = false,
  optionsSelected = []
}) => {
  // const [selected, setSelected] = useState(isSelected);

  const selected = optionsSelected?.includes(optionId);

  const className = " min-w-6  px-2 py-3  cursor-pointer   ";

  const getClassName = () => {
    if (!isSelectable && rightAnswers?.includes(optionId)) {
      return `${className} bg-green-500 text-gray-200 `;
    } else if (selected && !isSelectable && !rightAnswers?.includes(optionId)) {
      return `${className}   bg-red-500 text-gray-200`;
    } else if (selected) {
      return `${className}   bg-indigo-500 text-gray-200`;
    } else {
      return className;
    }
  };

  console.log(isSelectable);
  return (
    <div
      className={getClassName()}
      onClick={() => {
        if (isSelectable) {
          onOptionSelect(questionId, optionId);
          // setSelected((prevState) => !prevState);
        }
      }}
    >
      <FroalaEditorView model={option} />
    </div>
  );
};

export default Option;
