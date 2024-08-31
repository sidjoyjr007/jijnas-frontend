import { v4 as uuidV4 } from "uuid";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addAIQuizzes } from "../../../state/quiz.slice";
import axiosInstance from "../../../utils/axios-config.utils";
import { useNotification } from "../../../context/Notification.context";
import AIQuizForm from "../components/AIQuizForm";
import { generatePromptForQuiz } from "../../../utils/local.utils";
import { setQuizDetails } from "../../../state/quiz.slice";

const AIQuiz = () => {
  const user = useSelector((state) => state.user);
  const quiz = useSelector((state) => state.quiz);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitted, setSubmissionstatus] = useState(false);
  const [isDocumentSubmitted, setDocumentSubmission] = useState(false);
  const [file, setFile] = useState(quiz?.aiFile?.name || null);

  const { showNotification } = useNotification();

  useEffect(() => {
    dispatch(
      setQuizDetails({
        key: "aiFile",
        value: { name: "", id: "", fileSize: "" }
      })
    );
    dispatch(
      setQuizDetails({
        key: "aiText",
        value: { level: "", prompt: "", label: "" }
      })
    );
  }, []);

  const onFileSelect = (file) => {
    setFile(file);
    dispatch(
      setQuizDetails({
        key: "aiFile",
        value: { name: file?.name, id: "", fileSize: file?.size }
      })
    );
  };

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

  const handleDocumentBasedGeneration = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user?.userId);

    try {
      setDocumentSubmission(true);
      const res = await axiosInstance.post(
        "/api/v1/ai/file-assistant",
        formData
      );
      if (res.status === 200) {
        const jsonContentMatch = await res?.data?.answer?.value?.match(
          /```json\n([\s\S]+?)\n```/
        );

        let jsonContent = "";
        if (jsonContentMatch) {
          jsonContent = JSON.parse(jsonContentMatch[1]);
        } else {
          console.error("No JSON content found");
          setDocumentSubmission(false);
          showNotification(
            "Error",
            "Not able to generate quiz, please try again later",
            "alert"
          );

          return;
        }
        const quizzes = jsonContent?.quizzes || [];
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
        dispatch(
          setQuizDetails({
            key: "aiFile",
            value: {
              name: file?.name,
              id: res?.data?.fileId,
              assistantId: res?.data?.assistant,
              vectorStoreId: res?.data?.vectorStore,
              threadId: res?.data?.thread
            }
          })
        );
        navigate("/app/create-quiz/", {
          state: { ai: true }
        });
      }
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    } finally {
      setDocumentSubmission(false);
    }
  };

  return (
    <>
      <div className="xl:px-48 2xl:px-72 h-full  px-4 py-6  ">
        <AIQuizForm
          handleGenerateQuestions={handleGenerateQuestions}
          isSubmitted={isSubmitted}
          isDocumentSubmitted={isDocumentSubmitted}
          handleDocumentBasedGeneration={handleDocumentBasedGeneration}
          file={file}
          onFileSelect={onFileSelect}
        />
        {(isDocumentSubmitted || isSubmitted) && (
          <div className="mt-4 text-gray-300 font-medium text-lg">
            Sit back and relax. It takes some time to generate the quiz. In the
            meantime, please do not refresh the page or navigate to other pages.{" "}
          </div>
        )}
      </div>
    </>
  );
};

export default AIQuiz;
