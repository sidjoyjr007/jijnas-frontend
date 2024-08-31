import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { v4 as uuidv4 } from "uuid";

import { useSelector, useDispatch } from "react-redux";
import { addQuizOption } from "../state/quiz.slice";
const AddOptions = () => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz);
  const currentQuizId = quiz?.currentQuizId;
  const currentSlideId = quiz?.currentSlideId;
  const options =
    quiz?.quizStore?.[currentQuizId]?.[currentSlideId]?.options || [];

  const addOption = () => {
    const newOption = { value: "Hey", rightAnswer: false, id: uuidv4() };
    const optionsStateVal = [...options];
    optionsStateVal.push(newOption);
    dispatch(
      addQuizOption({
        currentQuizId,
        currentSlideId,
        options: optionsStateVal
      })
    );
  };

  const removeOption = (id) => {
    const index = options?.findIndex((item) => item?.id === id);
    if (index >= 0) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      dispatch(
        addQuizOption({
          currentQuizId,
          currentSlideId,
          options: newOptions
        })
      );
    }
  };

  const handleChange = (value, id) => {
    const index = options?.findIndex((item) => item?.id === id);
    if (index >= 0) {
      const newOptions = structuredClone(options);
      if (typeof value === "boolean") {
        newOptions[index]["rightAnswer"] = value;
      } else {
        newOptions[index]["value"] = value;
      }
      dispatch(
        addQuizOption({
          currentQuizId,
          currentSlideId,
          options: newOptions
        })
      );
    }
  };

  return (
    <div>
      <div
        onClick={() => addOption()}
        className="group flex items-center font-medium text-indigo-600 hover:text-indigo-900 justify-end cursor-pointer"
      >
        <PlusIcon aria-hidden="true" className="h-6 w-6" />
        <span>Add Option</span>
      </div>
      <div>
        {options?.map(({ value, id, rightAnswer }) => {
          return (
            <div key={id} className="flex flex-row items-center gap-2">
              <div className="mt-2 grow">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="company-website"
                    value={value}
                    name="company-website"
                    type="text"
                    onChange={(e) => handleChange(e.target.value, id)}
                    placeholder="www.example.com"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      checked={rightAnswer}
                      onChange={(e) => handleChange(e.target.checked, id)}
                      aria-describedby="offers-description"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-900"
                    >
                      Right Answer
                    </label>
                  </div>
                </div>{" "}
              </div>
              <div>
                <XMarkIcon
                  aria-hidden="true"
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => removeOption(id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddOptions;
