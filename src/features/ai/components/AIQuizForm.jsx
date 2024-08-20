import { useState, useSelector } from "react";
import TextInput from "../../../components/TextInput";
import SearchableSelect from "../../../components/SearchableSelect";
import Button from "../../../components/Button";

import {
  difficultyOptions,
  numberOfQuizOptions
} from "../../../utils/local.utils";
const AIQuizForm = ({ handleGenerateQuestions, isSubmitted }) => {
  const [formData, setFormData] = useState({
    quizInfo: "",
    quizNumber: "",
    level: ""
  });

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
    if (key === "quizInfo") {
      const nameValue = formData?.["quizInfo"]?.value;
      if (!value || value?.trim()?.length === 0)
        err = "Please enter valid quiz information";
      else if (value?.length < 10 || nameValue?.length > 100)
        err =
          "Minimum 10 characters and maximum 50 characters allowed for quiz information";
    } else if (key === "quizNumber") {
      if (!value) err = "Please select number of quizzes";
      //   else if (parseInt(value) < 1 || parseInt(value) > 50)
      //     err = "Minimum 1 and maximum 50 question can generate at a time";
    } else if (key === "level") {
      if (!value) err = "Please select level of diffculty";
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

  const getBtnDisabledStatus = () => {
    const { quizInfo, level } = formData;
    if (
      !quizInfo?.value ||
      quizInfo?.err ||
      !level?.value?.label ||
      level?.err
    ) {
      return true;
    }
    return false;
  };

  const handleSubmit = () => {
    handleGenerateQuestions(
      formData?.level?.value?.id,
      formData?.quizInfo?.value,
      "15-20"
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <TextInput
        label="Quiz Information"
        value={formData?.quizInfo?.value}
        onChange={(e) => handleFormData("quizInfo", e.target.value)}
        onBlur={() => handleBlur("quizInfo")}
        err={(formData?.quizInfo?.isTouched && formData?.quizInfo?.err) || ""}
        placeholder="e.g Physics thermodynamics questions"
      />
      <div>
        <SearchableSelect
          label="Difficulty Level"
          options={difficultyOptions}
          selectedOption={formData?.level?.value}
          setSelectedOption={(value) => handleFormData("level", value)}
        />
        <div className="mt-2 text-sm text-red-600">
          {formData?.level?.err && formData?.level?.err}
        </div>
      </div>

      <div className="flex w-full justify-end py-4">
        <Button
          label="Generate"
          handleSubmit={handleSubmit}
          isBtnDisabled={getBtnDisabledStatus()}
          isLoading={isSubmitted}
        />
      </div>
    </div>
  );
};

export default AIQuizForm;
