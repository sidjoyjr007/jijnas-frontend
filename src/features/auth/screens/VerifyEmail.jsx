import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import TextInput from "../../../components/TextInput";
import jijnasLogo from "../../../assets/logo.svg";
import axiosInstance from "../../../utils/axios-config.utils";
import { EMAIL_REGEX, OTP_REGEX } from "../../../utils/constant";
import {
  updateVerificationFlag,
  userIntialState
} from "../../../state/user.slice";
import { PWD_REGEX, textConstants } from "../../../utils/constant";
import { useNotification } from "../../../context/Notification.context";
import Button from "../../../components/Button";

const { validEmail, validVerificationCode, validPwd, validPwdRules } =
  textConstants;

const VerifyEmail = ({ email = "", isFpc = false, from = "" }) => {
  const [formData, setFormData] = useState({ email: { value: email } });
  const [isOTPRequested, setOTPrequestedStatus] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    let timer;
    if (isTimerActive && seconds > 0) {
      timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsTimerActive(false);
    }

    return () => clearTimeout(timer);
  }, [seconds, isTimerActive]);

  const handleFormDataChange = (key, value) => {
    let err = "";
    if (key === "email") {
      if (!value || !EMAIL_REGEX?.test(value)) err = validEmail;
    } else if (key === "verificationCode") {
      if (!value || !OTP_REGEX?.test(value)) err = validVerificationCode;
    } else if (key === "pwd") {
      if (!value) err = validPwd;
      else if (!PWD_REGEX?.test(value)) err = validPwdRules;
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

  const getSignupBtnDisabledStatus = () => {
    const {
      email = undefined,
      verificationCode = undefined,
      pwd = undefined
    } = formData;
    if (
      email?.value &&
      !email?.err &&
      verificationCode?.value &&
      !verificationCode?.err
    ) {
      if (isFpc && formData?.verificationCode?.isValid) {
        return !(pwd?.value && !pwd?.err);
      }
      return false;
    }

    return true;
  };

  const isSignupBtnDisabled = getSignupBtnDisabledStatus();

  const handleBlur = (key) => {
    setFormData({
      ...formData,
      [key]: {
        ...formData?.[key],
        isTouched: true
      }
    });
  };

  const handleVerifyEmail = async () => {
    if (formData?.verificationCode?.isValid) {
      const params = {
        email: formData?.email?.value?.toLowerCase(),
        pwd: formData?.pwd?.value
      };
      try {
        const res = await axiosInstance.post(
          "/api/v1/users/forgot-password",
          params
        );
        if (res.status === 200) {
          showNotification("Success", res?.data?.message, "success");
          navigate("/auth/login");
          return;
        }
        showNotification("Error", res?.data?.message, "alert");
      } catch (err) {
        showNotification("Error", err.response?.data.message, "alert");
      }
    } else {
      const params = {
        email: formData?.email?.value?.toLowerCase(),
        otp: formData?.verificationCode?.value
      };
      try {
        const res = await axiosInstance.post(
          "/api/v1/users/verify-email",
          params
        );
        if (res.status === 200) {
          showNotification("Success", res?.data?.message, "success");
          setFormData({
            ...formData,
            verificationCode: {
              ...formData.verificationCode,
              isValid: true
            }
          });
          dispatch(updateVerificationFlag());
          if (!isFpc) navigate("/app/my-quizzes");
          return;
        }
        showNotification("Error", res?.data?.message, "alert");
      } catch (err) {
        showNotification("Error", err.response?.data.message, "alert");
      }
    }
  };

  const requestOTP = async () => {
    if (!formData?.email?.value || formData?.email?.err) {
      setFormData({
        ...formData,
        email: {
          ...formData?.email,
          err: "Please enter valid Email",
          isTouched: true
        }
      });
      return;
    }

    setOTPrequestedStatus(true);
    setSeconds(45);
    setIsTimerActive(true);
    try {
      const result = await axiosInstance.post("/api/v1/users/request-otp", {
        email: formData?.email?.value?.toLowerCase()
      });
      if (result?.status === 200) {
        showNotification("Success", result?.data?.message, "success");
        return;
      }
      showNotification("Error", result?.data?.message, "alert");
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src={jijnasLogo}
            className="mx-auto h-18 w-16"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
            {isFpc && formData?.verificationCode?.isValid
              ? "Change Password"
              : "Verfiy Email"}{" "}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className=" px-6 py-4  sm:rounded-lg sm:px-12">
            <div className="space-y-4">
              <TextInput
                label="Email address"
                placeholder="Enter email"
                id="fp_email"
                name="fp_email"
                value={formData?.email?.value}
                onChange={(e) => handleFormDataChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                err={(formData?.email?.isTouched && formData?.email?.err) || ""}
                disabled={formData?.verificationCode?.isValid}
              />
              {!isOTPRequested && (
                <div
                  className=" text-right text-sm text-gray-500"
                  onClick={() => requestOTP()}
                >
                  <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer">
                    Request OTP
                  </span>
                </div>
              )}
              {isOTPRequested && (
                <TextInput
                  label="Verification code"
                  placeholder="Enter verification code"
                  id="fp_verification_code"
                  name="fp_verification_code"
                  value={formData?.verificationCode?.value || ""}
                  onChange={(e) =>
                    handleFormDataChange("verificationCode", e.target.value)
                  }
                  onBlur={() => handleBlur("verificationCode")}
                  err={
                    (formData?.verificationCode?.isTouched &&
                      formData?.verificationCode?.err) ||
                    ""
                  }
                  disabled={formData?.verificationCode?.isValid}
                />
              )}

              {isFpc && formData?.verificationCode?.isValid && (
                <>
                  <TextInput
                    label="Password"
                    placeholder="Enter password"
                    id="signup_pwd"
                    name="signup_pwd"
                    type={formData?.pwd?.isPWDVisible ? "text" : "password"}
                    value={formData?.pwd?.value || ""}
                    onChange={(e) =>
                      handleFormDataChange("pwd", e.target.value)
                    }
                    onBlur={() => handleBlur("pwd")}
                    err={(formData?.pwd?.isTouched && formData?.pwd?.err) || ""}
                  />

                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        checked={formData?.pwd?.isPWDVisible}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            pwd: {
                              ...formData.pwd,
                              isPWDVisible: e.target.checked
                            }
                          });
                        }}
                        id="showPassword"
                        name="show-password"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor="showPassword"
                        className="font-medium text-gray-400"
                      >
                        Show password
                      </label>
                    </div>
                  </div>
                </>
              )}

              {isOTPRequested && (
                <Button
                  label={
                    isFpc && formData?.verificationCode?.isValid
                      ? "Change Password"
                      : "verify"
                  }
                  handleSubmit={handleVerifyEmail}
                  isBtnDisabled={isSignupBtnDisabled}
                />
              )}
            </div>

            {isOTPRequested && !formData?.verificationCode?.isValid && (
              <p className="mt-10 text-center text-sm text-gray-500">
                Did not recieve code?{" "}
                <span
                  onClick={() => !isTimerActive && requestOTP()}
                  className={`font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ${
                    isTimerActive ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {isTimerActive ? `Resend in ${seconds}s` : "Resend"}
                </span>
              </p>
            )}
            <div className="flex items-center justify-center mt-6">
              <div className="text-sm leading-6">
                <div
                  onClick={() => {
                    !isFpc && dispatch(userIntialState());
                    isFpc && navigate("/auth/login");
                  }}
                  className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Go back
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
