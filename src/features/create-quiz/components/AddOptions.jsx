import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { addQuizOption } from "../../../state/quiz.slice";
import Editor from "../../../components/Editor";
import FroalaEditor from "froala-editor";
import SidePanel from "../../../components/SidePanel";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";
import { MinusIcon } from "@heroicons/react/20/solid";

const AddOptions = ({ dispatch, currentQuizId, currentSlideId, quiz }) => {
  const options =
    quiz?.slides?.[currentQuizId]?.[currentSlideId]?.options || [];
  const rightAnswers =
    quiz?.slides?.[currentQuizId]?.[currentSlideId]?.rightAnswers || [];

  const addOption = () => {
    const newOption = { value: "Hey", id: uuidv4() };
    const optionsStateVal = [...options];
    optionsStateVal.push(newOption);
    dispatch(
      addQuizOption({
        currentQuizId,
        currentSlideId,
        options: optionsStateVal,
        rightAnswers
      })
    );
  };

  const removeOption = (id) => {
    const index = options?.findIndex((item) => item?.id === id);
    const newRightAnswers = [...rightAnswers];

    if (index >= 0) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      const optionIdx = newRightAnswers?.findIndex(
        (optionId) => optionId === id
      );
      if (optionIdx === undefined || optionIdx === -1) {
        newRightAnswers.push(id);
      } else {
        newRightAnswers.splice(optionIdx, 1);
      }
      dispatch(
        addQuizOption({
          currentQuizId,
          currentSlideId,
          options: newOptions,
          rightAnswers: newRightAnswers
        })
      );
    }
  };

  const handleChange = (value, id) => {
    const index = options?.findIndex((item) => item?.id === id);

    if (index >= 0) {
      const newOptions = structuredClone(options);
      const newRightAnswers = [...rightAnswers];

      if (typeof value === "boolean") {
        const optionIdx = newRightAnswers?.findIndex(
          (optionId) => optionId === id
        );
        if (optionIdx === undefined || optionIdx === -1) {
          newRightAnswers.push(id);
        } else {
          newRightAnswers.splice(optionIdx, 1);
        }
      } else {
        newOptions[index]["value"] = value;
      }
      dispatch(
        addQuizOption({
          currentQuizId,
          currentSlideId,
          options: newOptions,
          rightAnswers: newRightAnswers
        })
      );
    }
  };

  return (
    <div>
      <div
        onClick={() => addOption()}
        className="group flex items-center font-medium text-indigo-500 hover:text-indigo-900 justify-end cursor-pointer"
      >
        <PlusIcon aria-hidden="true" className="h-6 w-6" />
        <span>Add Option</span>
      </div>
      <div className="flex flex-col gap-y-4 mt-4">
        {options?.map(({ value, id }, index) => {
          return (
            <div key={id} className="">
              <Disclosure key="explanation" as="div">
                <DisclosureButton className="bg-gray-600/10 rounded group relative flex w-full items-center justify-between py-3 px-2 text-left">
                  <span className="text-sm font-medium text-gray-400 group-data-[open]:text-indigo-600">
                    Option {index + 1}
                  </span>
                  <span className="ml-6 flex items-center">
                    <div className="flex mr-4 flex-row gap-2 justify-end ">
                      <div className="relative flex  items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="offers"
                            name="offers"
                            type="checkbox"
                            checked={rightAnswers?.includes(id)}
                            onChange={(e) => handleChange(e.target.checked, id)}
                            aria-describedby="offers-description"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="offers"
                            className="font-medium text-gray-400"
                          >
                            Right Answer
                          </label>
                        </div>
                      </div>
                    </div>
                    <PlusIcon
                      aria-hidden="true"
                      className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                    />
                    <MinusIcon
                      aria-hidden="true"
                      className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                    />
                    <div>
                      <XMarkIcon
                        aria-hidden="true"
                        className="h-6 w-6 cursor-pointer text-gray-400"
                        onClick={() => removeOption(id)}
                      />
                    </div>
                  </span>
                </DisclosureButton>
                <DisclosurePanel className="prose prose-sm pb-6">
                  <ul role="list" className="text-gray-600">
                    <div className="mt-2 grow px-4">
                      <div className="">
                        <Editor
                          model={value}
                          setModel={handleChange}
                          type={id}
                        />
                      </div>
                    </div>{" "}
                  </ul>
                </DisclosurePanel>
              </Disclosure>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddOptions;
