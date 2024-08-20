import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import en from "i18n-iso-countries/langs/en.json";
import countries from "i18n-iso-countries";

import TextInput from "../../../components/TextInput";
import jijnasLogo from "../../../assets/logo.svg";
import { EMAIL_REGEX, PWD_REGEX, textConstants } from "../../../utils/constant";
import { useNotification } from "../../../context/Notification.context";
import VerifyEmail from "./VerifyEmail";
import { signedup } from "../../../state/user.slice";
import Button from "../../../components/Button";
import axiosInstance from "../../../utils/axios-config.utils";
import { localToUTC } from "../../../utils/local.utils";
import SearchableSelect from "../../../components/SearchableSelect";

const {
  validName,
  validNameChars,
  validPwd,
  validPwdRules,
  selectCountry,
  validEmail,
  createNewAccount
} = textConstants;

const Signup = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [isPwdVisible, setPwdVisibility] = useState(false);
  const [isFormSubmitted, setFormSubmissionStatus] = useState(false);
  const { showNotification } = useNotification();
  const [countriesData, setCountries] = useState({});

  useEffect(() => {
    countries.registerLocale(en);
    const data = countries.getNames("en", { select: "official" });
    const countriesData = [];
    for (let [id, label] of Object.entries(data)) {
      countriesData.push({ id, label });
    }
    setCountries(countriesData);
  }, []);

  const handleFormDataChange = (key, value) => {
    let err = "";
    if (key === "name") {
      const nameValue = formData?.["name"]?.value;
      if (!value || value?.trim()?.length === 0) err = validName;
      else if (value?.length < 3 || nameValue?.length > 15)
        err = validNameChars;
    } else if (key === "email") {
      if (!value || !EMAIL_REGEX?.test(value)) err = validEmail;
    } else if (key === "password") {
      if (!value) err = validPwd;
      else if (!PWD_REGEX?.test(value)) err = validPwdRules;
    } else if (key === "country") {
      if (!value) err = selectCountry;
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
      password = undefined,
      country = undefined
    } = formData;
    if (
      name?.value &&
      !name?.err &&
      email?.value &&
      !email?.err &&
      password?.value &&
      !password?.err &&
      country?.value?.label &&
      !country?.err
    )
      return false;
    return true;
  };

  const isSignupBtnDisabled = getSignupBtnDisabledStatus();

  const handleSignupSubmit = async () => {
    const params = {
      name: formData?.name?.value?.trim().toLowerCase(),
      email: formData?.email?.value.toLowerCase(),
      password: formData?.password?.value,
      countryCode: formData?.country?.value?.id,
      createdAt: localToUTC(new Date())
    };

    try {
      setFormSubmissionStatus(true);
      const result = await axiosInstance.post("/api/v1/users/signup", params);
      if (result.status === 200) {
        showNotification("Success", result?.data?.message, "success");
        dispatch(signedup({ data: result?.data?.userDetails }));
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

  return (
    <>
      {user?.isLoggedIn && !user?.verified && (
        <VerifyEmail
          email={formData?.email?.value || user?.userEmail}
          from="/auth/signup"
        />
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
              {createNewAccount}
            </h2>
          </div>

          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className=" px-6 py-4 sm:rounded-lg sm:px-12">
              <div className="space-y-4">
                <TextInput
                  label="Name"
                  placeholder="Enter name"
                  id="signup_name"
                  name="signup_name"
                  value={formData?.name?.value || ""}
                  onChange={(e) => handleFormDataChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  err={(formData?.name?.isTouched && formData?.name?.err) || ""}
                />

                <TextInput
                  label="Email address"
                  placeholder="Enter Email"
                  id="signup_email"
                  name="signup_email"
                  value={formData?.email?.value || ""}
                  onChange={(e) =>
                    handleFormDataChange("email", e.target.value)
                  }
                  onBlur={() => handleBlur("email")}
                  err={
                    (formData?.email?.isTouched && formData?.email?.err) || ""
                  }
                />

                <TextInput
                  label="Password"
                  placeholder="Enter password"
                  id="signup_pwd"
                  name="signup_pwd"
                  type={isPwdVisible ? "text" : "password"}
                  value={formData?.password?.value || ""}
                  onChange={(e) =>
                    handleFormDataChange("password", e.target.value)
                  }
                  onBlur={() => handleBlur("password")}
                  err={
                    (formData?.password?.isTouched &&
                      formData?.password?.err) ||
                    ""
                  }
                />
                <div className="relative flex justify-end">
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

                <div>
                  <SearchableSelect
                    label="Select Country"
                    options={countriesData}
                    selectedOption={formData?.country?.value}
                    setSelectedOption={(value) => {
                      handleFormDataChange("country", value);
                    }}
                  />
                  <div className="mt-2 text-sm text-red-600">
                    {formData?.country?.err}
                  </div>
                </div>

                <div>
                  <Button
                    label="Signup"
                    handleSubmit={handleSignupSubmit}
                    isBtnDisabled={isSignupBtnDisabled}
                    isLoading={isFormSubmitted}
                  />
                </div>
              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already a member?{" "}
                <Link
                  to="/auth/login"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Please Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
