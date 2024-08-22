import TextInput from "../../../components/TextInput";
import Button from "../../../components/Button";
import SearchableSelect from "../../../components/SearchableSelect";
import { useState } from "react";
import { difficultyOptions } from "../../../utils/local.utils";
import { useSelector, useDispatch } from "react-redux";
import { setQuizDetails } from "../../../state/quiz.slice";
import Textarea from "../../../components/Textarea";

const AIText = ({ handleGenerateQuestions, isSubmitted }) => {
  const quiz = useSelector((state) => state.quiz);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    quizInfo: { value: quiz?.aiText?.prompt || "" },
    level: {
      value: { id: quiz?.aiText?.level || "", label: quiz?.aiText?.label }
    }
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

  const handleTextFormData = (key, value) => {
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

  const handleTextSubmit = () => {
    const level = formData?.level?.value?.id;
    const prompt = formData?.quizInfo?.value;
    const label = formData?.level?.value?.label;
    dispatch(
      setQuizDetails({ key: "aiText", value: { level, prompt, label } })
    );
    handleGenerateQuestions(level, prompt, "15-20");
  };

  const getBtnDisabledStatus = () => {
    const { quizInfo, level } = formData || {};
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
  return (
    <div className="flex flex-col gap-y-4">
      <Textarea
        label="Quiz Information"
        value={formData?.quizInfo?.value}
        onChange={(e) => handleTextFormData("quizInfo", e.target.value)}
        onBlur={() => handleBlur("quizInfo")}
        err={(formData?.quizInfo?.isTouched && formData?.quizInfo?.err) || ""}
        placeholder="e.g Physics thermodynamics questions"
      />
      <div>
        <SearchableSelect
          label="Difficulty Level"
          options={difficultyOptions}
          selectedOption={formData?.level?.value}
          setSelectedOption={(value) => handleTextFormData("level", value)}
        />
        <div className="mt-2 text-sm text-red-600">
          {formData?.level?.err && formData?.level?.err}
        </div>
      </div>

      <div className="flex w-full justify-end py-4">
        <Button
          label="Generate"
          handleSubmit={handleTextSubmit}
          isBtnDisabled={getBtnDisabledStatus()}
          isLoading={isSubmitted}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default AIText;
