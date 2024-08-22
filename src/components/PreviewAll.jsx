import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PreviewAll = ({ preview = true }) => {
  const { quizId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    if (quizId) {
      (async () => {
        setQuizLoadingStatus(true);
        try {
          const res = await axiosInstance.get(
            `/api/v1/quiz/my-quiz?quizId=${quizId}`
          );
          if (res.status === 200) {
            formatQuizData(res?.data?.results[0]);
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
    if (selectedOptions?.length === 0) return;
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
          <Dialog
            open={sidebarOpen}
            onClose={setSidebarOpen}
            className="relative z-50 lg:hidden"
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 flex">
              <DialogPanel
                transition
                className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
              >
                <TransitionChild>
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="-m-2.5 p-2.5"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        aria-hidden="true"
                        className="h-6 w-6 text-white"
                      />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900/80 pb-2">
                  <div className="px-4 py-3 text-xl text-gray-400 ">
                    Questions
                  </div>

                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="divide-y divide-white/5">
                          {questionLabels?.map((item) => (
                            <li
                              onClick={() => {
                                handleQuestionChange(item?.id);
                                setSidebarOpen(false);
                              }}
                              key={item.id}
                              className="px-2 flex items-center justify-between hover:bg-gray-800 cursor-pointer"
                            >
                              <div
                                href={item.label}
                                className={classNames(
                                  item.id === questions?.currentQuestionId
                                    ? " text-indigo-500 "
                                    : "text-gray-400 hover:text-indigo-500",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6"
                                )}
                              >
                                {item.label}
                              </div>
                              <CheckCircleIcon
                                className={`h-6 w-6 ${
                                  questionsData?.[item?.id]?.isSubmitted
                                    ? "text-indigo-500"
                                    : "text-gray-400"
                                } `}
                              />
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </div>
          </Dialog>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 left-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r border-white/5  bg-gray-900/80 ">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col hover:overflow-y-auto border-r border-white/5 ">
              <div className="px-4 py-3 text-xl text-gray-400 ">Questions</div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className=" divide-y divide-white/5">
                      {questionLabels?.map((item) => (
                        <li
                          onClick={() => handleQuestionChange(item?.id)}
                          key={item.id}
                          className=" px-2 flex items-center justify-between hover:bg-gray-800 cursor-pointer"
                        >
                          <div
                            href={item.label}
                            className={classNames(
                              item.id === questions?.currentQuestionId
                                ? " text-indigo-500 "
                                : "text-gray-400 hover:text-indigo-500",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6"
                            )}
                          >
                            {item.label}
                          </div>
                          <CheckCircleIcon
                            className={`h-6 w-6 ${
                              questionsData?.[item?.id]?.isSubmitted
                                ? "text-indigo-500"
                                : "text-gray-400"
                            } `}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="sticky top-0 z-40 flex items-center gap-x-6  px-4 py-4 shadow-sm sm:px-6 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6 text-gray-300" />
            </button>
          </div>

          <main className=" lg:pl-72  pl-0 ">
            <div className="  mx-4 mt-2 rounded-xl border-2  border-white/5">
              <div className="py-4 flex justify-between  rounded-t-md border-b-2 border-white/5 bg-gray-700/10 text-gray-400  px-4 font-medium ">
                <div className=" text-gray-400 text-sm xl:text-base ">
                  {quizzes?.[questions?.currentQuestionId]?.questionName}
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
