import axiosInstance from "../utils/axios-config.utils";

export const getMyQuizzes = async (userId) => {
  try {
    const res = await axiosInstance.get(
      `/api/v1/quiz/my-quizzes?userId=${userId}`
    );
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getMyQuiz = async (quizId) => {
  try {
    const res = await axiosInstance.get(
      `/api/v1/quiz/my-quiz?quizId=${quizId}`
    );
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};
