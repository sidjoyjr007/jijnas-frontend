import Editor from "../../../components/Editor";

import TextInput from "../../../components/TextInput";
const Question = ({
  dispatch,
  updateQuizName,
  currentQuizId,
  currentSlideId,
  quizName,
  questionModel,
  setModel
}) => {
  return (
    <div>
      <div className="col-span-full mb-6">
        <div className="mt-2">
          <TextInput
            value={quizName}
            name="question-name"
            type="text"
            placeholder="Enter Quiz Name"
            onChange={(e) =>
              dispatch(
                updateQuizName({
                  currentQuizId,
                  currentSlideId,
                  name: e.target.value
                })
              )
            }
            label="Question Name"
          />
        </div>
      </div>
      <div>
        <div className="mb-2 block text-sm font-medium leading-6 text-gray-200">
          Question
        </div>
        <Editor model={questionModel} type="question" setModel={setModel} />
      </div>
    </div>
  );
};

export default Question;
