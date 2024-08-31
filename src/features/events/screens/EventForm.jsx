import { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidV4 } from "uuid";

import TextInput from "../../../components/TextInput";
import jijnasLogo from "../../../assets/logo.svg";
import { EMAIL_REGEX, PWD_REGEX } from "../../../utils/constant";
import { useNotification } from "../../../context/Notification.context";
import { signedup } from "../../../state/user.slice";
import Button from "../../../components/Button";
import axiosInstance from "../../../utils/axios-config.utils";

const EventForm = ({
  additionalInfo = "",
  setFormVisibiltyStatus,
  eventId,
  quizzes,
  setRefreshStatus
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    additionalInfo: ""
  });
  const [isFormSubmitted, setFormSubmissionStatus] = useState(false);
  const { showNotification } = useNotification();

  const validateForm = (key, value) => {
    let err = "";
    if (key === "name") {
      const nameValue = formData?.["name"]?.value;
      if (!value || value?.trim()?.length === 0)
        err = "Please enter valid name";
      else if (value?.length < 3 || nameValue?.length > 15)
        err = "Minimum 3 characters and maximum 15 characters allowed for name";
    } else if (key === "email") {
      if (!value) err = "Please enter valid email";
      else if (!EMAIL_REGEX?.test(value)) err = "Please enter valid email";
    } else if (key === "additionalInfo") {
      if (!value) err = `Please enter ${additionalInfo}`;
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

  const handleFormDataChange = (value, key) => {
    validateForm(key, value);
  };

  const handleBlur = (key) => {
    setFormData({
      ...formData,
      [key]: {
        ...formData?.[key],
        isTouched: true
      }
    });
  };

  const getSignupBtnDisabledStatus = () => {
    const {
      name = undefined,
      email = undefined,
      additionalInfo: info
    } = formData;
    if (name?.value && !name?.err && email?.value && !email?.err) {
      if (additionalInfo) {
        return !(info?.value && !info?.err);
      }
      return false;
    }
    return true;
  };

  const isSignupBtnDisabled = getSignupBtnDisabledStatus();

  const handleSignupSubmit = async () => {
    const params = {
      name: formData?.name?.value?.trim(),
      email: formData?.email?.value,
      additionalInfo: formData?.additionalInfo?.value || null,
      userEventId: uuidV4(),
      eventId
    };

    try {
      setFormSubmissionStatus(true);
      const result = await axiosInstance.post(
        "/api/v1/quiz/register-user",
        params
      );
      if (result.status === 200) {
        showNotification("Success", result?.data?.message, "success");
        setFormVisibiltyStatus(false);
        sessionStorage.setItem(
          "userEventData",
          JSON.stringify(result?.data?.userData)
        );
        if (result?.data?.userData?.questionData) {
          setRefreshStatus((prevState) => !prevState);
        }
        return;
      }
      showNotification("Error", result?.data?.message, "alert");
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    } finally {
      setFormSubmissionStatus(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src={jijnasLogo}
            className="mx-auto h-18 w-16"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
            Enter Your Information
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className=" px-6 py-12 sm:rounded-lg sm:px-12">
            <div className="space-y-6">
              <TextInput
                label="Name"
                placeholder="Enter name"
                id="event_name"
                name="event_name"
                value={formData?.name?.value || ""}
                onChange={(e) => handleFormDataChange(e.target.value, "name")}
                onBlur={() => handleBlur("name")}
                err={(formData?.name?.isTouched && formData?.name?.err) || ""}
              />

              <TextInput
                label="Email address"
                placeholder="Enter Email"
                id="event_email"
                name="event_email"
                value={formData?.email?.value || ""}
                onChange={(e) => handleFormDataChange(e.target.value, "email")}
                onBlur={() => handleBlur("email")}
                err={(formData?.email?.isTouched && formData?.email?.err) || ""}
              />

              {additionalInfo && (
                <TextInput
                  label={additionalInfo}
                  placeholder={`Enter ${additionalInfo}`}
                  id="signup_pwd"
                  name="signup_pwd"
                  type="text"
                  value={formData?.additionalInfo?.value || ""}
                  onChange={(e) =>
                    handleFormDataChange(e.target.value, "additionalInfo")
                  }
                  onBlur={() => handleBlur("password")}
                  err={
                    (formData?.additionalInfo?.isTouched &&
                      formData?.additionalInfo?.err) ||
                    ""
                  }
                />
              )}

              <div>
                <Button
                  label="Get Started"
                  handleSubmit={handleSignupSubmit}
                  isBtnDisabled={isSignupBtnDisabled}
                  isLoading={isFormSubmitted}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventForm;
