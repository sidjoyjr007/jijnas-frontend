import { useState } from "react";
import Editor from "./Editor";
import SidePanel from "./SidePanel";
import AddOptions from "./AddOptions";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import OptionsList from "./OptionsList";
import { useSelector } from "react-redux";

const items = ["Question", "Options", "explanation"];

const QuizSheet = () => {
  const [panelItem, setPanelItem] = useState("");

  const quiz = useSelector((state) => state?.quiz);
  const currentQuizId = quiz?.currentQuizId;
  const currentSlideId = quiz?.currentSlideId;
  const options =
    quiz?.quizStore?.[currentQuizId]?.[currentSlideId]?.options || [];
  console.log(options);
  const questionModel =
    quiz?.quizStore?.[currentQuizId]?.[currentSlideId]?.question || "";
  const explanationModel =
    quiz?.quizStore?.[currentQuizId]?.[currentSlideId]?.explanation || "";
  const handleClose = () => setPanelItem("");
  return (
    <div>
      <div>
        <div className="flex rounded-2xl  justify-end">
          <button
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            Add/Edit
          </button>
          <Menu as="div" className="relative -ml-px block">
            <MenuButton className="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
              <span className="sr-only">Open options</span>
              <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                {items.map((item) => (
                  <MenuItem key={item}>
                    <a
                      onClick={() => setPanelItem(item)}
                      className="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      {item}
                    </a>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
        <div>
          <div className="mb-4">
            <span className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
              <svg
                viewBox="0 0 6 6"
                aria-hidden="true"
                className="h-1.5 w-1.5 fill-indigo-500"
              >
                <circle r={3} cx={3} cy={3} />
              </svg>
              Question
            </span>
          </div>
          <div className="indent-2">
            <FroalaEditorView model={questionModel} />
          </div>
        </div>

        <div>
          <OptionsList options={options} />
        </div>

        <div>
          <div className="mb-4">
            <span className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
              <svg
                viewBox="0 0 6 6"
                aria-hidden="true"
                className="h-1.5 w-1.5 fill-indigo-500"
              >
                <circle r={3} cx={3} cy={3} />
              </svg>
              explanation
            </span>
          </div>
          <FroalaEditorView model={explanationModel} />
        </div>
      </div>
      {panelItem === "Question" && (
        <div>
          <SidePanel
            content={
              <Editor model={questionModel} setModel={setQuestionModel} />
            }
            sidePanelTitle="Add Question"
            handleClose={handleClose}
          />
        </div>
      )}
      {panelItem === "Options" && (
        <div>
          <SidePanel
            content={<AddOptions options={options} setOptions={setOptions} />}
            sidePanelTitle="Add Options"
            handleClose={handleClose}
          />
        </div>
      )}
      {panelItem === "explanation" && (
        <div>
          <SidePanel
            content={
              <Editor model={explanationModel} setModel={setexplanationModel} />
            }
            sidePanelTitle="Add explanation"
            handleClose={handleClose}
          />
        </div>
      )}
    </div>
  );
};

export default QuizSheet;
