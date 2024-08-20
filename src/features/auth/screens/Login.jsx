import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import VerifyEmail from "./VerifyEmail";

import TextInput from "../../../components/TextInput";
import jijnasLogo from "../../../assets/logo.svg";
import { EMAIL_REGEX, textConstants } from "../../../utils/constant";
import { signedup } from "../../../state/user.slice";
import { useNotification } from "../../../context/Notification.context";
import Button from "../../../components/Button";
import axiosInstance from "../../../utils/axios-config.utils";

const { validEmail, validPwd } = textConstants;

const Login = () => {
  const [formData, setFormData] = useState({});
  const [isPwdVisible, setPwdVisibility] = useState(false);
  const [isFormSubmitted, setFormSubmissionStatus] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  if (user?.loggedIn) {
    navigate("/app/create-quiz");
  }

  const validateForm = (key, value) => {
    let err = "";
    if (key === "email") {
      if (!value || !EMAIL_REGEX?.test(value)) err = validEmail;
    } else if (key === "password") {
      if (!value) err = validPwd;
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
    const { email = undefined, password = undefined } = formData;
    if (email?.value && !email?.err && password?.value && !password?.err)
      return false;
    return true;
  };

  const isSignupBtnDisabled = getSignupBtnDisabledStatus();

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

  const handleLoginSubmit = async () => {
    const params = {
      email: formData?.email?.value.toLowerCase(),
      password: formData?.password?.value
    };

    try {
      setFormSubmissionStatus(true);
      const result = await axiosInstance.post("/api/v1/users/login", params);
      if (result.status === 200) {
        showNotification("Success", result?.data?.message, "success");
        dispatch(signedup({ data: result.data?.userDetails }));
        setFormData({});
        return;
      }
      showNotification("Error", result?.data?.message, "alert");
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    } finally {
      setFormSubmissionStatus(false);
    }
  };

  useEffect(() => {
    console.log("log in");
  }, []);
  return (
    <>
      {user?.isLoggedIn && !user?.verified && (
        <VerifyEmail email={user?.userEmail} from="/auth/login" />
      )}
      {!user?.isLoggedIn && (
        <div className="flex min-h-full flex-1 flex-col justify-center py-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              alt="Your Company"
              src={jijnasLogo}
              className="mx-auto h-18 w-16"
            />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className=" px-6 py-4 sm:rounded-lg sm:px-12">
              <div className="space-y-4">
                <TextInput
                  label="Email address"
                  placeholder="Enter Email"
                  id="signin_email"
                  name="signin_email"
                  value={formData?.email?.value || ""}
                  onChange={(e) =>
                    handleFormDataChange(e.target.value, "email")
                  }
                  onBlur={() => handleBlur("email")}
                  err={
                    (formData?.email?.isTouched && formData?.email?.err) || ""
                  }
                />

                <TextInput
                  label="Password"
                  placeholder="Enter password"
                  id="signin_pwd"
                  name="signin_pwd"
                  type={isPwdVisible ? "text" : "password"}
                  value={formData?.password?.value || ""}
                  onChange={(e) =>
                    handleFormDataChange(e.target.value, "password")
                  }
                  onBlur={() => handleBlur("password")}
                  err={
                    (formData?.password?.isTouched &&
                      formData?.password?.err) ||
                    ""
                  }
                />

                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      checked={isPwdVisible}
                      onChange={(e) => setPwdVisibility(e.target.checked)}
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
                <div className="flex items-center justify-end">
                  <div className="text-sm leading-6">
                    <Link
                      to="/auth/forgot-password"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    label="Login"
                    handleSubmit={handleLoginSubmit}
                    isBtnDisabled={isSignupBtnDisabled}
                    isLoading={isFormSubmitted}
                  />
                </div>
              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{" "}
                <Link
                  to="/auth/signup"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Please Signup
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
