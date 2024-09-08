import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LockClosedIcon,
  LockOpenIcon
} from "@heroicons/react/24/outline";
import { BounceLoader } from "react-spinners";

import OptionsList from "./OptionsList";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";
import { PlusIcon, MinusIcon, LightBulbIcon } from "@heroicons/react/20/solid";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { useParams } from "react-router-dom";
import Button from "./Button";
import axiosInstance from "../utils/axios-config.utils";
import { useNotification } from "../context/Notification.context";
import EmptyState from "../components/EmptyState";
import Tooltip from "./Tooltip";

const PreviewAll = () => {
  const { quizId } = useParams();
  const [quizName, setQuizName] = useState("");
  const [quizzes, setQuizzes] = useState({});
  const [questions, setQuesions] = useState({
    labels: [],
    currentQuestionId: "",
    rightAnswers: [],
    currentIndex: 1
  });
  const [questionsData, setSubmission] = useState({});
  const [isQuizLoading, setQuizLoadingStatus] = useState(false);

  const { showNotification } = useNotification();
  const formatQuizData = (quizzes) => {
    const quizObj = {};
    quizzes?.slides?.length &&
      quizzes?.slides?.forEach(
        (quiz) => (quizObj[quiz?.slideId] = { ...quiz })
      );
    setQuizzes(quizObj);
    const rightAnswersObj = {};
    const questionLabels =
      (quizzes?.slides?.length &&
        quizzes?.slides?.map((quiz) => {
          const slideId = quiz.slideId;
          rightAnswersObj[slideId] = {
            rightAnswers: quiz.rightAnswers || []
          };
          return { id: slideId, label: quiz?.questionName };
        })) ||
      [];
    setQuesions({
      labels: questionLabels,
      currentQuestionId: questionLabels?.[0]?.id,
      currentIndex: 1
    });
    setSubmission({
      ...questionsData,
      ...rightAnswersObj
    });
  };

  useEffect(() => {
    // Function to remove the parent div of the selected elements
    const maskElement = (elements) => {
      elements.forEach((element) => {
        const parentDiv = element.closest("p"); // Find the closest parent div
        if (parentDiv) {
          parentDiv.remove(); // Remove the parent div from the DOM
        }
      });
    };

    // Function to observe changes in the DOM
    const observeDOMChanges = (selector) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const matchingElements = node.querySelectorAll(selector);
              maskElement(Array.from(matchingElements));
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Initial check in case the elements are already present
      const initialElements = document.querySelectorAll(selector);
      if (initialElements.length > 0) {
        maskElement(Array.from(initialElements));
      }

      // Cleanup function to disconnect the observer when the component unmounts
      return () => observer.disconnect();
    };

    // Use the appropriate selector to match any href containing "froala.com"
    const selector = 'a[href*="froala.com"]';

    // Start observing
    const disconnectObserver = observeDOMChanges(selector);

    // Cleanup function to disconnect the observer when the component unmounts
    return () => {
      disconnectObserver();
    };
  }, []);

  useEffect(() => {
    if (quizId) {
      (async () => {
        setQuizLoadingStatus(true);
        try {
          const res = await axiosInstance.get(
            `/api/v1/quiz/my-quiz?quizId=${quizId}`
          );
          if (res.status === 200) {
            const response = res?.data?.results[0];
            formatQuizData(response || []);
            setQuizName(response?.quizName);
            return;
          }
          showNotification("Error", res?.data?.message, "alert");
        } catch (err) {
          showNotification("Error", err.response?.data.message, "alert");
        } finally {
          setQuizLoadingStatus(false);
        }
      })();
    }
  }, [quizId]);

  const questionLabels = questions?.labels;

  const handleQuestionChange = (id) => {
    const idx = questionLabels?.findIndex((question) => question?.id === id);
    if (idx === -1) return;
    setQuesions((prevState) => {
      return {
        ...prevState,
        currentQuestionId: id,
        currentIndex: idx + 1
      };
    });
  };

  const onOptionSelect = (questionId, optionId) => {
    const idx = questionsData?.[questionId]?.selectedOptions?.findIndex(
      (id) => id === optionId
    );
    const selectedOptions = [
      ...(questionsData?.[questionId]?.selectedOptions || [])
    ];
    if (idx === undefined || idx === -1) {
      selectedOptions.push(optionId);
    } else {
      selectedOptions.splice(idx, 1);
    }

    setSubmission({
      ...questionsData,
      [questionId]: {
        ...questionsData?.[questionId],
        selectedOptions
      }
    });
  };

  const handleAnswerSubmit = () => {
    const questionId = questions?.currentQuestionId;
    const selectedOptions = questionsData?.[questionId]?.selectedOptions || [];
    if (selectedOptions?.length === 0) {
      showNotification(
        "Warning",
        "Please select option(s) before submitting",
        "warning"
      );
      return;
    }
    setSubmission({
      ...questionsData,
      [questionId]: {
        ...questionsData?.[questionId],
        isSubmitted: true
      }
    });
  };

  return (
    <>
      {isQuizLoading && (
        <div className="h-screen flex justify-center items-center">
          <BounceLoader size="60" color="#6366f1" />
        </div>
      )}

      {!isQuizLoading && questions?.labels?.length > 0 ? (
        <div className="h-screen">
          <main className="   pl-0 ">
            <div className="  mx-4 mt-2 rounded-xl border-2  border-white/5">
              <div className="py-4 flex justify-between  rounded-t-md border-b-2 border-white/5 bg-gray-700/10 text-gray-400  px-4 font-medium ">
                <div className=" text-gray-400 text-sm xl:text-base ">
                  {quizName}
                </div>
              </div>
              <div className="px-6 py-6 h-70vh overflow-auto text-gray-200  bg-gray-700/10 text-sm xl:text-base">
                <div>
                  <FroalaEditorView
                    model={
                      quizzes?.[questions?.currentQuestionId]?.question || ""
                    }
                  />
                </div>
                <div className="px-4">
                  <OptionsList
                    options={
                      quizzes?.[questions?.currentQuestionId]?.options || []
                    }
                    onOptionSelect={onOptionSelect}
                    questionId={questions?.currentQuestionId}
                    optionsSelected={
                      questionsData?.[questions?.currentQuestionId]
                        ?.selectedOptions || []
                    }
                    isSelectable={
                      !questionsData?.[questions?.currentQuestionId]
                        ?.isSubmitted
                    }
                    rightAnswers={
                      questionsData?.[questions?.currentQuestionId]
                        ?.rightAnswers
                    }
                  />
                </div>
                <div>
                  <Disclosure key="explanation" as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <div className=" flex gap-4 font-medium text-xl text-gray-500 group-data-[open]:text-indigo-600">
                          <Tooltip
                            position="bottom"
                            message="Explanation will be shown once participant submits answer"
                          >
                            <div className="flex gap-x-4">
                              <div>explanation</div>
                              <div>
                                {questionsData?.[questions?.currentQuestionId]
                                  ?.isSubmitted ? (
                                  <LockOpenIcon className="h-6 w-6" />
                                ) : (
                                  <LockClosedIcon className="h-6 w-6" />
                                )}
                              </div>
                            </div>
                          </Tooltip>
                        </div>
                        {questionsData?.[questions?.currentQuestionId]
                          ?.isSubmitted && (
                          <div className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                            />
                          </div>
                        )}
                      </DisclosureButton>
                    </h3>
                    {questionsData?.[questions?.currentQuestionId]
                      ?.isSubmitted && (
                      <DisclosurePanel className="prose prose-sm pb-6">
                        <ul role="list" className="text-gray-400 font-medium">
                          <FroalaEditorView
                            model={
                              quizzes?.[questions?.currentQuestionId]
                                ?.explanation || "No explanation found"
                            }
                          />
                        </ul>
                      </DisclosurePanel>
                    )}
                  </Disclosure>
                </div>
              </div>
              <div className="flex justify-end py-2 px-4 bg-gray-700/10 rounded-b-lg border-t-2 border-white/5">
                <div className="flex gap-4 items-center">
                  <div className="text-gray-400">
                    {questions?.currentIndex}/{questionLabels?.length}
                  </div>
                  <span className="isolate inline-flex rounded-md shadow-sm">
                    <button
                      disabled={questions?.currentIndex === 1}
                      onClick={() => {
                        handleQuestionChange(
                          questionLabels?.[questions?.currentIndex - 2]?.id
                        );
                      }}
                      type="button"
                      className=" disabled:cursor-not-allowed relative inline-flex items-center rounded-l-md border-white/5 bg-transparent px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-gray-700/10 focus:z-10"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        handleQuestionChange(
                          questionLabels?.[questions?.currentIndex]?.id
                        );
                      }}
                      disabled={
                        questions?.currentIndex === questionLabels?.length
                      }
                      type="button"
                      className="disabled:cursor-not-allowed relative inline-flex items-center rounded-r-md border-white/5 bg-transparent px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-gray-700/10 focus:z-10"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </button>
                  </span>
                  <Button
                    label="Submit"
                    handleSubmit={handleAnswerSubmit}
                    disabled={
                      questionsData?.[questions?.currentQuestionId]
                        ?.isSubmitted || false
                    }
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <EmptyState
            icon={<LightBulbIcon className="h-6 w-6 text-gray-200" />}
            msg="Unable to load quiz, please save before previewing"
          />
        </div>
      )}
    </>
  );
};

export default PreviewAll;
