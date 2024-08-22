import { v4 as uuidV4 } from "uuid";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addAIQuizzes } from "../../../state/quiz.slice";
import axiosInstance from "../../../utils/axios-config.utils";
import { useNotification } from "../../../context/Notification.context";
import AIQuizForm from "../components/AIQuizForm";
import { generatePromptForQuiz } from "../../../utils/local.utils";

const PromptQuiz = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitted, setSubmissionstatus] = useState(false);
  const { showNotification } = useNotification();

  const handleGenerateQuestions = async (level, info, quizNumber) => {
    const question = generatePromptForQuiz(level, info, quizNumber);
    const data = {
      question,
      userId: user?.userId
    };

    try {
      setSubmissionstatus(true);
      const res = await axiosInstance.post("/api/v1/ai/generate-quiz", data);
      if (res.status === 200) {
        const quizzes = JSON.parse(res?.data?.response)?.quizzes || [];
        const currentQuizId = uuidV4();
        let currentSlideId = "";
        const data = { [currentQuizId]: {} };
        quizzes?.forEach((quiz, index) => {
          const rightAnswers = [];
          const options = quiz?.options?.map((option) => {
            const optionId = uuidV4();
            if (option?.rightAnswer) rightAnswers.push(optionId);
            return { value: option?.value, id: optionId };
          });
          const slideId = uuidV4();
          data[currentQuizId][slideId] = {
            slideId,
            options,
            rightAnswers,
            explanation: quiz?.explanation,
            questionName: quiz?.questionName,
            name: quiz?.questionName,
            question: quiz?.question,
            changed: true
          };
          if (index === 0) currentSlideId = slideId;
        });
        const currentQuizName = `Untitled_Quiz_${uuidV4()}`;
        dispatch(
          addAIQuizzes({ data, currentQuizId, currentQuizName, currentSlideId })
        );
        navigate("/app/create-quiz/", {
          state: { ai: true }
        });
      }
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    } finally {
      setSubmissionstatus(false);
    }
  };

  return (
    <>
      <div className="xl:px-48 2xl:px-72 h-full  px-4 py-6  ">
        <div className=" bg-gray-600/10 rounded-md  px-4 py-4 flex flex-col border border-white/5 gap-y-4">
          <div className="text-3xl text-gray-300 py-4">Generate AI Quiz</div>
          <AIQuizForm
            handleGenerateQuestions={handleGenerateQuestions}
            isSubmitted={isSubmitted}
          />
        </div>
      </div>
    </>
  );
};

export default PromptQuiz;
