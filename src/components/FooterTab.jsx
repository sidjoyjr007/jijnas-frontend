import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSelector, useDispatch } from "react-redux";

import { addQuiz, setSlide } from "../state/quiz.slice";

const FooterTab = ({ onRemoveQuizSlide }) => {
  const quiz = useSelector((state) => state.quiz);
  const dispatch = useDispatch();

  const currentQuizId = quiz?.currentQuizId;
  const currentSlideId = quiz?.currentSlideId;
  const quizSlides = quiz?.slides?.[currentQuizId] || [];

  const addNewSlide = () => {
    dispatch(addQuiz({ currentQuizId }));
  };

  return (
    <div className="  h-12  flex items-center gap-2  hover:overflow-auto overflow-hidden">
      <div className="pr-4">
        <PlusIcon
          className="block h-8 w-8 text-gray-400  cursor-pointer"
          onClick={() => addNewSlide()}
        />
      </div>

      {Object?.keys(quizSlides)?.map((slide) => {
        return (
          <div
            className="group  relative flex gap-1 items-center group"
            key={slide}
          >
            <div
              className={`  text-gray-50 cursor-pointer  ${
                slide === currentSlideId && "border-b-2 border-indigo-500"
              }`}
              onClick={() => dispatch(setSlide({ slideId: slide }))}
            >
              <span className=" truncate inline-flex items-center text-sm gap-x-0.5 rounded-sm bg-gray-700/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-500/10">
                {quizSlides?.[slide]?.name}
              </span>
            </div>

            <button
              onClick={() => onRemoveQuizSlide(slide)}
              type="button"
              className="  hidden absolute -left-2 -top-2 rounded-lg -mr-1 h-4 w-4  bg-gray-500/20 group-hover:flex "
            >
              <span className="sr-only">Remove</span>
              <XMarkIcon className="h-4 w-4 text-indigo-400" />
              <span className="absolute -inset-1" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FooterTab;
