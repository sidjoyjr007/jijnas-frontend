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

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";
import { PlusIcon, MinusIcon, LightBulbIcon } from "@heroicons/react/20/solid";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { useParams } from "react-router-dom";
import OptionsList from "../../../components/OptionsList";
import Button from "../../../components/Button";
import EmptyState from "../../../components/EmptyState";
import { useNotification } from "../../../context/Notification.context";
import axiosInstance from "../../../utils/axios-config.utils";
import EventForm from "./EventForm";
import { localToUTC, utcToLocal } from "../../../utils/local.utils";
import Countdown from "react-countdown";
import { getEventStatus, STATUS } from "../../../utils/local.utils";
import AlertDialog from "../../../components/AlertDilaog";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const QuizEvent = () => {
  const { eventId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizzes, setQuizzes] = useState({});
  const [dialogData, setDialogData] = useState({});

  const [questions, setQuesions] = useState({
    labels: [],
    currentQuestionId: "",
    rightAnswers: [],
    currentIndex: 1
  });
  const [eventData, setEventData] = useState("");

  const [questionsData, setSubmission] = useState({});
  const [isQuizLoading, setQuizLoadingStatus] = useState(false);
  const [showForm, setFormVisibiltyStatus] = useState(false);
  const [eventStatus, setEventStatus] = useState("");
  const [answerStats, setAnswerStats] = useState({
    attended: 0,
    right: 0,
    wrong: 0
  });
  const [quizfinished, setQuizFinished] = useState(false);

  const [refresh, setRefreshStatus] = useState(false);

  const { showNotification } = useNotification();
  console.log(quizzes, questions, questionsData);

  useEffect(() => {
    const userEventId = JSON.parse(
      sessionStorage.getItem("userEventData")
    )?.userEventId;

    console.log(userEventId);
    setQuizLoadingStatus(true);
    try {
      (async () => {
        const userTime = localToUTC(new Date().valueOf());
        const res = await axiosInstance.get(
          `/api/v1/quiz/event-details?eventId=${eventId}&userEventId=${userEventId}&userTime=${userTime}`
        );
        setQuizLoadingStatus(false);
        if (res.status === 200) {
          const eventData = res?.data?.eventsRes?.[0];

          const userEventData = res?.data?.userEventData?.[0];
          const status = getEventStatus(
            eventData?.startTime,
            parseInt(eventData?.timings)
          );
          if (status === STATUS.COMPLETED) setQuizFinished(true);
          if (!userEventId && status === STATUS.STARTED)
            setFormVisibiltyStatus(true);
          setEventStatus(status);
          if (
            !userEventData?.length &&
            eventData?.length &&
            status === STATUS.NOT_STARTED
          )
            return;

          const qData = userEventData?.questionData;
          if (userEventData?.answerStats) {
            setAnswerStats(userEventData?.answerStats);
          }
          setEventData(eventData || "");
          setQuizFinished(userEventData?.finished || false);

          formatQuizData(res?.data?.quizRes, qData);
          return;
        }
        showNotification("Error", res?.data?.message, "alert");
      })();
    } catch (err) {
      setQuizLoadingStatus(false);
      showNotification("Error", err.response?.data.message, "alert");
    }
  }, [refresh]);

  const formatQuizData = (quizzes, qData) => {
    const quizObj = {};
    quizzes?.length &&
      quizzes?.forEach((quiz) => (quizObj[quiz?.slideId] = { ...quiz }));
    setQuizzes(quizObj);
    const rightAnswersObj = {};
    const questionLabels =
      (quizzes?.length &&
        quizzes?.map((quiz) => {
          const slideId = quiz.slideId;
          rightAnswersObj[slideId] = {
            rightAnswers: quiz.rightAnswers || []
          };
          return { id: slideId, label: quiz?.questionName };
        })) ||
      [];
    console.log(quizObj, questionLabels);
    setQuesions({
      labels: questionLabels,
      currentQuestionId: questionLabels?.[0]?.id,
      currentIndex: 1
    });
    setSubmission({
      ...questionsData,
      ...rightAnswersObj,
      ...qData
    });
  };

  const onAlertDialogClose = () => {
    setDialogData({ show: false });
  };

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
    if (!quizfinished) {
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
    }
  };

  const handleAnswerSubmit = async () => {
    const questionId = questions?.currentQuestionId;

    if (!questionsData?.[questionId]?.isSubmitted && !quizfinished) {
      const selectedOptions =
        questionsData?.[questionId]?.selectedOptions || [];
      const rightAnswers = questionsData?.[questionId]?.rightAnswers || [];

      if (selectedOptions?.length === 0) return;

      const isRight = selectedOptions?.every((option) =>
        rightAnswers?.includes(option)
      );

      console.log(isRight);
      const answerStat = {
        attended: answerStats?.attended + 1,
        right: isRight ? answerStats?.right + 1 : answerStats?.right,
        wrong: !isRight ? answerStats?.wrong + 1 : answerStats?.wrong
      };
      console.log(answerStat);
      setAnswerStats(answerStat);
      setSubmission({
        ...questionsData,
        [questionId]: {
          ...questionsData?.[questionId],
          isSubmitted: true
        }
      });
      const params = {
        userEventId: JSON.parse(sessionStorage.getItem("userEventData"))
          ?.userEventId,
        key: questionId,
        value: { rightAnswers, selectedOptions, isSubmitted: true },
        answerStats: answerStat
      };
      try {
        const res = await axiosInstance.post(
          "/api/v1/quiz/submit-answer",
          params
        );
        if (res?.status !== 200) {
          showNotification("Error", res?.data?.message, "alert");
          setSubmission({
            ...questionsData,
            [questionId]: {
              ...questionsData?.[questionId],
              isSubmitted: false
            }
          });
        }
      } catch (err) {
        showNotification("Error", err.response?.data.message, "alert");
        setSubmission({
          ...questionsData,
          [questionId]: {
            ...questionsData?.[questionId],
            isSubmitted: true
          }
        });
      }
    }
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed && eventStatus === STATUS.NOT_STARTED) {
      return <span>You can now refresh browser to get started</span>;
    } else if (
      (completed || quizfinished) &&
      eventStatus !== STATUS.NOT_STARTED
    ) {
      setQuizFinished(true);
      return <span>Quiz Time Over - score {answerStats?.right}</span>;
    } else {
      return (
        <span>
          {hours}H:{minutes}M:{seconds}S{" "}
          {eventStatus === STATUS.NOT_STARTED && "Left"}
        </span>
      );
    }
  };

  const handleFinishQuiz = async () => {
    setDialogData({ show: false });
    try {
      const res = await axiosInstance.get(
        `/api/v1/quiz/finish-quiz?userEventId=${
          JSON.parse(sessionStorage.getItem("userEventData"))?.userEventId
        }&time=${localToUTC(Date.now())}`
      );
      if (res?.status === 200) {
        showNotification("Success", res?.data?.message, "success");
        setQuizFinished(true);
        return;
      }
      showNotification("Error", res?.data?.message, "alert");
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    }
  };

  return (
    <>
      {isQuizLoading && (
        <div className="h-screen flex justify-center items-center">
          <BounceLoader size="60" color="#6366f1" />
        </div>
      )}
      {!isQuizLoading && eventStatus === STATUS.NOT_STARTED && (
        <div className=" flex-col h-screen flex justify-center items-center">
          <div className="text-gray-300 font-medium bg-white/5 rounded p-2 mb-4">
            <Countdown
              date={utcToLocal(eventData?.startTime)}
              renderer={renderer}
            />
          </div>

          <EmptyState
            icon={<LightBulbIcon className="h-6 w-6 text-gray-200" />}
            msg="This quiz event has not been started"
          />
        </div>
      )}

      {/* {!isQuizLoading && eventStatus === STATUS && (
        <div className="h-screen flex justify-center items-center">
          <EmptyState
            icon={<LightBulbIcon className="h-6 w-6 text-gray-200" />}
            msg="This quiz event already been completed"
          />
        </div>
      )} */}
      {showForm && !isQuizLoading && (
        <EventForm
          additionalInfo={eventData?.additionalInfo}
          setFormVisibiltyStatus={setFormVisibiltyStatus}
          eventId={eventData?.eventId}
          questionData={questionsData}
          setQuestionData={setSubmission}
          setRefreshStatus={setRefreshStatus}
          quizzes={quizzes}
        />
      )}
      {!isQuizLoading && !showForm && questions?.labels?.length > 0 && (
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
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {questionLabels?.map((item) => (
                            <li key={item.id}>
                              <a
                                href={item.label}
                                className={classNames(
                                  item.id === questions?.currentQuestionId
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}
                              >
                                {item.label}
                              </a>
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
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
            <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
              Dashboard
            </div>
          </div>

          <main className=" lg:pl-72   ">
            {/* <div className="flex justify-between px-4 mb-4 ">
              <div className="text-md w-full flex justify-end text-gray-200 mt-4 mb-4 ">
                <Countdown
                  date={
                    utcToLocal(eventData?.startTime) +
                    parseInt(eventData?.timing) * 60 * 1000
                  }
                  renderer={renderer}
                />
              </div>
            </div> */}

            <div className="  mx-4 mt-4 rounded-xl border-2  border-white/5">
              <div className="py-4 flex justify-between  rounded-t-md border-b-2 border-white/5 bg-gray-700/10 text-gray-400  px-4 font-medium ">
                <div className=" text-xl text-gray-400 ">
                  {eventData?.eventName || ""}
                </div>
                <div className="flex  flex-row gap-x-4 items-center">
                  <div className=" bg-white/5 rounded p-2">
                    <Countdown
                      date={
                        utcToLocal(eventData?.startTime) +
                        parseInt(eventData?.timing) * 60 * 1000
                      }
                      renderer={renderer}
                    />
                  </div>

                  {!quizfinished && (
                    <Button
                      label="Finish Quiz"
                      variant="secondary"
                      handleSubmit={() => {
                        setDialogData({
                          show: true,
                          msgHeader: "Finish Quiz",
                          msg: "Finishing quiz, you will not able to do any changes to this quiz later"
                        });
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="px-6 py-6 h-70vh overflow-auto text-gray-200  bg-gray-700/10">
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
                              ?.isSubmitted || quizfinished ? (
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
                    {(questionsData?.[questions?.currentQuestionId]
                      ?.isSubmitted ||
                      quizfinished) && (
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
      )}
      {!isQuizLoading && !eventStatus && questions?.labels?.length === 0 && (
        <div className="h-screen flex justify-center items-center">
          <EmptyState
            icon={<LightBulbIcon className="h-6 w-6 text-gray-200" />}
            msg="Unable to load quiz event, please contact quiz creator to verify about this event"
          />
        </div>
      )}
      {dialogData?.show && (
        <AlertDialog
          show={dialogData?.show}
          msgHeader={dialogData?.msgHeader}
          msg={dialogData?.msg}
          onClose={() => onAlertDialogClose()}
          onConfirm={() => handleFinishQuiz()}
        />
      )}
    </>
  );
};

export default QuizEvent;
