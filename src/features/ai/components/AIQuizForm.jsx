import { useState } from "react";

import RadioGroupComponent from "../../../components/RadioGroup";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { Bars3CenterLeftIcon } from "@heroicons/react/24/solid";

import AIText from "./AIText";
import AIDocument from "./AIDocument";

const options = [
  { name: "Document", icon: DocumentPlusIcon },
  { name: "Text", icon: Bars3CenterLeftIcon }
];

const AIQuizForm = ({
  handleGenerateQuestions,
  isSubmitted,
  isDocumentSubmitted,
  handleDocumentBasedGeneration,
  file,
  onFileSelect
}) => {
  const [selectedOption, setOption] = useState(options[0]);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="w-full ">
        <RadioGroupComponent
          options={options}
          selectedOption={selectedOption}
          setOption={setOption}
        />
      </div>
      {selectedOption?.name === "Text" && (
        <AIText
          handleGenerateQuestions={handleGenerateQuestions}
          isSubmitted={isSubmitted}
        />
      )}
      {selectedOption?.name === "Document" && (
        <AIDocument
          isDocumentSubmitted={isDocumentSubmitted}
          handleDocumentBasedGeneration={handleDocumentBasedGeneration}
          file={file}
          onFileSelect={onFileSelect}
        />
      )}
    </div>
  );
};

export default AIQuizForm;
