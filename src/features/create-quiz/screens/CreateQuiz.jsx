import { useState, useRef, useEffect, useCallback } from "react";
import {
  PencilIcon,
  LightBulbIcon,
  ArrowPathRoundedSquareIcon
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { EyeIcon, DocumentTextIcon } from "@heroicons/react/20/solid";

import {
  createNewQuiz,
  removeQuiz,
  setQuizQuestion,
  updateQuizName,
  addQuiz,
  updateCurrentQuizName
} from "../../../state/quiz.slice";
import Question from "../components/Question";
import AddOptions from "../components/AddOptions";
import Explanation from "../components/Explanation";
import FooterTab from "../../../components/FooterTab";
import EmptyState from "../../../components/EmptyState";
import axiosInstance from "../../../utils/axios-config.utils";
import { changeSlideStatus } from "../../../state/quiz.slice";
import Button from "../../../components/Button";
import { useNotification } from "../../../context/Notification.context";
import { localToUTC, generatePromptForQuiz } from "../../../utils/local.utils";
import SidePanel from "../../../components/SidePanel";
import AIQuizForm from "../../ai/components/AIQuizForm";
import { addAIQuizzes, setQuizDetails } from "../../../state/quiz.slice";

const CreateQuiz = ({ isCreate = true }) => {
  const [savingQuiz, setQuizSavingStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSubmitted, setSubmissionstatus] = useState(false);
  const [isDocumentSubmitted, setDocumentSubmission] = useState(false);
  const [file, setFile] = useState(null);

  const quiz = useSelector((state) => state.quiz);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;
  const ai = state?.ai || false;
  const quiztitleRef = useRef();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isCreate && !ai) {
      dispatch(createNewQuiz());
    }

    // return () => {
    //   dispatch(
    //     setQuizDetails({
    //       key: "aiFile",
    //       value: { name: "", id: "", fileSize: "" }
    //     })
    //   );
    // };
  }, []);

  const currentQuizId = quiz?.currentQuizId;
  const currentSlideId = quiz?.currentSlideId;
  const currentQuizName = quiz?.currentQuizName;
  const currentSlide = quiz?.slides?.[currentQuizId]?.[currentSlideId];
  const questionModel = currentSlide?.question || "";
  const explanationModel = currentSlide?.explanation || "";
  const quizName = currentSlide?.name || "";

  const slidesLength =
    (quiz?.slides?.[currentQuizId] &&
      Object.keys(quiz?.slides?.[currentQuizId])?.length) ||
    0;

  const setModel = useCallback(
    (value, type) => {
      const payload = {
        currentQuizId,
        currentSlideId,
        value,
        type
      };
      dispatch(setQuizQuestion(payload));
    },
    [currentSlideId, currentSlideId]
  );

  const onFileSelect = (file) => {
    setFile(file);
    dispatch(
      setQuizDetails({
        key: "aiFile",
        value: { name: file?.name, id: "", fileSize: file?.size }
      })
    );
  };

  const onRemoveQuizSlide = (slideId) => {
    dispatch(removeQuiz({ currentQuizId, slideId, currentSlideId }));
  };

  const saveQuiz = () => {
    const slides =
      (quiz.slides?.[currentQuizId] && quiz.slides?.[currentQuizId]) || {};
    const slidesKeys = Object.keys(slides) || [];
    const urls = [];

    setQuizSavingStatus(true);
    slidesKeys?.forEach(async (key) => {
      const slide = slides?.[key];
      if (slide?.changed) {
        const data = {
          quizId: currentQuizId,
          slideId: key,
          quizName: currentQuizName,
          userId: user?.userId,
          lastUpdated: localToUTC(new Date().valueOf()),
          totalQuestions: slidesKeys?.length,
          options: slide?.options,
          questionName: slide?.name,
          question: slide?.question,
          explanation: slide?.explanation,
          rightAnswers: slide?.rightAnswers
        };

        urls.push({ url: "/api/v1/quiz/save", data });
      }
    });
    if (urls?.length) {
      const requests = urls.map(({ url, data }) => {
        return axiosInstance.post(url, data);
      });
      try {
        Promise.all(requests)
          .then((response) => {
            if (response?.length) {
              response?.forEach(({ data }) => {
                dispatch(
                  changeSlideStatus({
                    changed: false,
                    currentQuizId,
                    slideId: data?.slideId
                  })
                );
              });
              showNotification("Success", "Quiz added Successfully", "success");
              setQuizSavingStatus(false);
            }
          })
          .catch((err) => {
            setQuizSavingStatus(false);
            showNotification("Error", err.response?.data.message, "alert");
          });
      } catch (err) {
        setQuizSavingStatus(false);
        showNotification("Error", err.response?.data.message, "alert");
      }
    } else {
      showNotification("Success", "Quiz added Successfully", "success");
      setQuizSavingStatus(false);
    }
  };

  const handleGenerateQuestions = async (level, info, quizNumber) => {
    let questionsToAvoid = "";
    quiz?.slides?.[currentQuizId] &&
      Object.keys(quiz?.slides?.[currentQuizId])?.forEach((slideId, index) => {
        questionsToAvoid += quiz?.slides?.[currentQuizId]?.[slideId]?.name;
        if (index !== Object.keys(quiz?.slides?.[currentQuizId])?.length)
          questionsToAvoid += ",";
      });

    const question = generatePromptForQuiz(
      level,
      info,
      quizNumber,
      questionsToAvoid
    );

    const data = {
      question,
      userId: user?.userId
    };

    try {
      setSubmissionstatus(true);
      const res = await axiosInstance.post("/api/v1/ai/generate-quiz", data);
      let currentSlideId = "";
      if (res.status === 200) {
        const quizzes = JSON.parse(res?.data?.response)?.quizzes || [];
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

        const currentQuizName = quiz.currentQuizName;

        data[currentQuizId] = {
          ...data[currentQuizId],
          ...quiz?.slides?.[currentQuizId]
        };

        dispatch(
          addAIQuizzes({
            data,
            currentQuizId,
            currentQuizName,
            currentSlideId
          })
        );
      }
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    } finally {
      setSubmissionstatus(false);
      setOpen(false);
    }
  };

  const processDoucmentResponse = (res) => {
    const jsonContentMatch = res?.answer?.value?.match(
      /```json\n([\s\S]+?)\n```/
    );
    let jsonContent = "";
    if (jsonContentMatch) {
      jsonContent = JSON.parse(jsonContentMatch[1]);
    } else {
      return false;
    }
    const quizzes = jsonContent?.quizzes || [];

    if (!quizzes?.length) return false;
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
    const currentQuizName = quiz.currentQuizName;
    data[currentQuizId] = {
      ...data[currentQuizId],
      ...quiz?.slides?.[currentQuizId]
    };
    dispatch(
      addAIQuizzes({
        data,
        currentQuizId,
        currentQuizName,
        currentSlideId
      })
    );
    dispatch(
      setQuizDetails({
        key: "aiFile",
        value: {
          name: file?.name,
          id: res?.fileId,
          assistantId: res?.assistant,
          vectorStoreId: res?.vectorStore,
          threadId: res?.thread
        }
      })
    );
    setOpen(false);

    return true;
  };

  const handleDocumentBasedGeneration = async () => {
    const fileId = quiz?.aiFile?.id;
    const assistantId = quiz?.aiFile?.assistantId;
    const vectoreStoreId = quiz?.aiFile?.vectorStoreId;
    const threadId = quiz?.aiFile?.threadId;
    const fileSize = quiz?.aiFile?.fileSize;
    let questionsToAvoid = "";
    quiz?.slides?.[currentQuizId] &&
      Object.keys(quiz?.slides?.[currentQuizId])?.forEach((slideId, index) => {
        questionsToAvoid += quiz?.slides?.[currentQuizId]?.[slideId]?.name;
        if (index !== Object.keys(quiz?.slides?.[currentQuizId])?.length)
          questionsToAvoid += ",";
      });

    const instructions = questionsToAvoid
      ? `Please do not repeat any questions related to these topics  "${questionsToAvoid}"`
      : "";

    if (fileId) {
      try {
        setDocumentSubmission(true);
        const res = await axiosInstance.post("/api/v1/ai/regenerate-in-file", {
          fileId,
          assistantId,
          vectoreStoreId,
          threadId,
          fileSize,
          userId: user?.userId,
          instructions
        });
        const result = processDoucmentResponse(res?.data);
        if (!result) {
          showNotification(
            "Error",
            "Unable to generate quiz, please try again later",
            "alert"
          );
        }
      } catch (err) {
        showNotification("Error", err.response?.data.message, "alert");
      } finally {
        setDocumentSubmission(false);
        setOpen(false);
      }
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user?.userId);
      formData.append("instructions", instructions);
      try {
        setDocumentSubmission(true);
        const res = await axiosInstance.post(
          "/api/v1/ai/file-assistant",
          formData
        );
        if (res.status === 200) {
          const result = processDoucmentResponse(res?.data);

          if (!result) {
            showNotification(
              "Error",
              "Unable to generate quiz, please try again later",
              "alert"
            );
          }
        }
      } catch (err) {
        showNotification("Error", err.response?.data.message, "alert");
      } finally {
        setDocumentSubmission(false);
      }
    }
  };

  return (
    <div className="  rounded-lg  h-full overflow-auto">
      {slidesLength ? (
        <>
          <div className="bg-gray-700/10">
            <div className="flex justify-between  flex-wrap border-b border-white/5 p-6">
              <div className="flex gap-2  ">
                <div
                  onBlur={(e) => {
                    dispatch(
                      updateCurrentQuizName({
                        quizName: e.currentTarget.textContent
                      })
                    );
                  }}
                  ref={quiztitleRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="text-gray-400 text-sm"
                >
                  {currentQuizName}
                </div>
                <PencilIcon
                  onClick={() => quiztitleRef.current.focus()}
                  className="h-4 w-4 cursor-pointer text-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  label="Preview"
                  variant="secondary"
                  icon={<EyeIcon className="h-4 w-4" />}
                  handleSubmit={() =>
                    window.open(
                      `/preview/${currentQuizId}`,
                      "_blank",
                      "noopener noreferrer"
                    )
                  }
                />
                <Button
                  label="Save"
                  icon={<DocumentTextIcon className="h-4 w-4" />}
                  handleSubmit={saveQuiz}
                  isLoading={savingQuiz}
                />
              </div>
            </div>

            <div className="px-6 py-2 border-b border-white/5">
              <FooterTab onRemoveQuizSlide={onRemoveQuizSlide} />
            </div>
          </div>
          {currentSlideId && (
            <>
              <div className="mt-6 mb-4 flex items-center justify-center lg:items-center lg:justify-center">
                <div className="xl:px-20 2xl:px-72 h-full  px-4 py-6  ">
                  <div className=" bg-gray-600/10 border border-white/5 rounded-md  px-4 py-4 flex flex-col  gap-y-4">
                    <Question
                      dispatch={dispatch}
                      updateQuizName={updateQuizName}
                      currentQuizId={currentQuizId}
                      currentSlideId={currentSlideId}
                      quizName={quizName}
                      questionModel={questionModel}
                      setModel={setModel}
                    />
                    <div className="py-2">
                      <AddOptions
                        dispatch={dispatch}
                        quiz={quiz}
                        currentQuizId={currentQuizId}
                        currentSlideId={currentSlideId}
                      />
                    </div>
                    <div className="py-2">
                      <Explanation
                        explaintionModel={explanationModel}
                        setModel={setModel}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center mt-6">
          <EmptyState
            msg="Start adding quiz questions"
            icon={<LightBulbIcon className="h-8 w-8 text-gray-200" />}
            onBtnClick={() => dispatch(addQuiz({ currentQuizId }))}
          />
        </div>
      )}
      <div className="fixed bottom-6  right-6 z-50 cursor-pointer ">
        <Button
          handleSubmit={() => setOpen(true)}
          label={
            <div className="flex gap-x-2">
              <ArrowPathRoundedSquareIcon className="h-6 w-6" />
              <span>Generate Quiz</span>{" "}
            </div>
          }
        />
      </div>
      <SidePanel
        open={open}
        sidePanelTitle="Generate Quiz"
        handleClose={() => setOpen(false)}
        content={
          <>
            <AIQuizForm
              handleGenerateQuestions={handleGenerateQuestions}
              isSubmitted={isSubmitted}
              isDocumentSubmitted={isDocumentSubmitted}
              handleDocumentBasedGeneration={handleDocumentBasedGeneration}
              file={file}
              onFileSelect={onFileSelect}
            />
            {(isDocumentSubmitted || isSubmitted) && (
              <div className="mt-8 text-gray-300 font-medium text-lg">
                Sit back and relax. It takes some time to generate the quiz. In
                the meantime, please do not refresh the page or navigate to
                other pages.{" "}
              </div>
            )}
          </>
        }
      />
    </div>
  );
};

export default CreateQuiz;
