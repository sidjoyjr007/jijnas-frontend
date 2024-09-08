import TextInput from "../../../components/TextInput";
import { v4 as uuidV4 } from "uuid";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, isBefore, addMinutes } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";

import { addQuizToQuizList } from "../../../state/quiz.slice";
import SearchableSelect from "../../../components/SearchableSelect";
import Button from "../../../components/Button";
import axiosInstance from "../../../utils/axios-config.utils";
import { useNotification } from "../../../context/Notification.context";
import { BounceLoader } from "react-spinners";
import EmptyState from "../../../components/EmptyState";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { localToUTC } from "../../../utils/local.utils";

const CreateEvent = () => {
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quiz: "",
    timings: 30,
    addInfo: ""
  });

  const now = new Date();
  const currentDate = format(now, "yyyy-MM-dd");
  const minTime = addMinutes(now, 15);
  const formattedMinTime = format(minTime, "HH:mm");

  const quiz = useSelector((state) => state.quiz);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isQuizLoading, setQuizLoadingStatus] = useState(false);
  const [isSubmitted, setSubmissionstatus] = useState(false);
  const { showNotification } = useNotification();
  const location = useLocation();
  const { state } = location;

  const { quizData } = state || {};

  useEffect(() => {
    (async () => {
      setQuizLoadingStatus(true);
      try {
        const res = await axiosInstance.get(
          `/api/v1/quiz/my-quizzes?userId=${user?.userId}`
        );
        if (res.status === 200) {
          dispatch(addQuizToQuizList({ data: res?.data?.result }));
          return;
        }
        showNotification("Error", res?.data?.message, "alert");
      } catch (err) {
        showNotification("Error", err.response?.data.message, "alert");
      } finally {
        setQuizLoadingStatus(false);
      }
    })();
  }, []);

  useEffect(() => {
    const newOption = [...options, quizData];
    setOptions(newOption);
    setFormData({
      quiz: {
        value: quizData
      }
    });
  }, [quizData]);

  useEffect(() => {
    if (quiz?.quizList?.length) {
      const options = quiz?.quizList?.map((quiz) => {
        return { id: quiz?.quizId, label: quiz?.quizName };
      });
      options?.length && setOptions(options);
    }
  }, [quiz]);

  const handleBlur = (key) => {
    setFormData({
      ...formData,
      [key]: {
        ...formData?.[key],
        isTouched: true
      }
    });
  };

  const handleFormData = (key, value) => {
    let err = "";
    if (key === "name") {
      const nameValue = formData?.["name"]?.value;
      if (!value || value?.trim()?.length === 0)
        err = "Please enter valid event name";
      else if (value?.length < 3 || nameValue?.length > 15)
        err =
          "Minimum 3 characters and maximum 15 characters allowed for event name";
    } else if (key === "timings") {
      if (!value) err = "Please enter timings in minutes";
      else if (parseInt(value) < 5)
        err = "Timings should be at least 5 minutes";
    } else if (key === "quiz") {
      if (!value) err = "Please select quiz";
    } else if (key === "date") {
      if (!value) err = "Please select event date";
    } else if (key === "time") {
      if (!value) err = "Please select event time";
      else if (formData?.date?.value && value) {
        const selectedDateTime = new Date(`${formData?.date?.value}T${value}`);
        const minDateTime = new Date(`${currentDate}T${formattedMinTime}`);

        if (isBefore(selectedDateTime, minDateTime)) {
          err = "Selected time must be at least 15 minutes in the future.";
        }
      }
    }

    setFormData({
      ...formData,
      [key]: {
        ...formData?.[key],
        value,
        err
      }
    });
  };

  const handleCreateEvent = async () => {
    const dateTimeString = `${formData?.date?.value}T${formData?.time?.value}:00`;
    const startTime = new Date(dateTimeString).valueOf();
    const data = {
      eventId: uuidV4(),
      eventName: formData?.name?.value,
      quizId: formData?.quiz?.value,
      timing: formData?.timings?.value,
      additionalInfo: formData?.addInfo?.value,
      userId: user?.userId,
      startTime: localToUTC(startTime),
      createdAt: localToUTC(new Date().valueOf())
    };
    try {
      setSubmissionstatus(true);

      const res = await axiosInstance.post("/api/v1/quiz/create-event", data);
      if (res.status === 200) {
        showNotification("Success", res?.data?.message, "success");
        navigate("/app/events");
        return;
      }
      showNotification("Error", res?.data?.message, "alert");
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    } finally {
      setSubmissionstatus(false);
    }
  };

  const getBtnDisabledStatus = () => {
    const { name, timings, quiz, time, date } = formData;
    if (
      !name?.value ||
      name?.err ||
      !timings?.value ||
      timings?.err ||
      !quiz?.value?.label ||
      quiz?.err ||
      !date?.value ||
      date?.err ||
      !time?.value ||
      time.err
    ) {
      return true;
    }
    return false;
  };

  const EmptyQuiz = (
    <div>
      Did not found any quizzes to create an event, please try again if there
      were or{" "}
      <span
        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer"
        onClick={() => navigate("/app/create-quiz")}
      >
        Create new one here
      </span>
    </div>
  );

  return (
    <>
      {isQuizLoading && (
        <div className="h-70vh flex justify-center items-center">
          <BounceLoader size="60" color="#6366f1" />
        </div>
      )}

      {quiz?.quizList?.length > 0 && !isQuizLoading && (
        <div className="xl:px-48 2xl:px-72 h-full  px-4 py-6 ">
          <div className=" bg-gray-600/10 rounded-md  px-4 py-4 flex flex-col border border-white/5 gap-y-4">
            <div className="text-3xl text-gray-200 py-4 ">
              Create Quiz Event
            </div>

            <div>
              <TextInput
                label="Event Name"
                value={formData?.name?.value}
                onChange={(e) => handleFormData("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                err={(formData?.name?.isTouched && formData?.name?.err) || ""}
              />
            </div>
            <div className="mt-4">
              <SearchableSelect
                label="Select Quiz"
                options={options}
                selectedOption={formData?.quiz?.value}
                setSelectedOption={(value) => handleFormData("quiz", value)}
              />
              <div className="mt-2 text-sm text-red-600">
                {formData?.quiz?.err && formData?.quiz?.err}
              </div>
            </div>

            <div className="mt-4">
              <TextInput
                label="Quiz Timings (in minutes)"
                type="number"
                value={formData?.timings?.value}
                onChange={(e) => handleFormData("timings", e.target.value)}
                onBlur={() => handleBlur("timings")}
                err={
                  (formData?.timings?.isTouched && formData?.timings?.err) || ""
                }
              />
            </div>
            <div className="mt-4">
              <TextInput
                label="Event Date"
                type="date"
                id="date"
                value={formData?.date?.value}
                min={currentDate}
                onChange={(e) => handleFormData("date", e.target.value)}
                onBlur={() => handleBlur("date")}
                err={(formData?.date?.isTouched && formData?.date?.err) || ""}
              />
            </div>
            <div className="mt-4">
              <TextInput
                label="Event Time"
                type="time"
                id="time"
                value={formData?.time?.value}
                min={formattedMinTime}
                onChange={(e) => handleFormData("time", e.target.value)}
                onBlur={() => handleBlur("time")}
                err={(formData?.time?.isTouched && formData?.time?.err) || ""}
              />
            </div>
            <div className="mt-4">
              <span className="text-xl  text-gray-200">Additional Info</span>
              <div className="text-sm font-medium text-gray-400">
                We collect information such as email and name from users who
                attend the quiz. If you need to collect any additional
                information (e.g., student ID/employee ID), please add it to the
                input field below.
              </div>
              <div className="mt-4">
                <TextInput
                  label=""
                  type="text"
                  value={formData?.["addInfo"]?.value}
                  onChange={(e) => handleFormData("addInfo", e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full justify-end py-4">
              <Button
                label="submit"
                handleSubmit={handleCreateEvent}
                isBtnDisabled={getBtnDisabledStatus()}
                isLoading={isSubmitted}
              />
            </div>
          </div>
        </div>
      )}
      {!quiz?.quizList?.length && !isQuizLoading && (
        <div className="h-70vh flex justify-center items-center">
          <EmptyState
            icon={<LightBulbIcon className="h-6 w-6 text-gray-400" />}
            msg={EmptyQuiz}
          />
        </div>
      )}
    </>
  );
};

export default CreateEvent;
