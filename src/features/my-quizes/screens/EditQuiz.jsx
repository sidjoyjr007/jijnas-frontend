import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreateQuiz from "../../create-quiz/screens/CreateQuiz";
import { getMyQuiz } from "../../../actions/quiz.actions";
import { addQuizToQuizstore } from "../../../state/quiz.slice";
import EmptyState from "../../../components/EmptyState";
import { BounceLoader } from "react-spinners";
import { LightBulbIcon } from "@heroicons/react/24/outline";
const EditQuiz = () => {
  const { quizId } = useParams();
  const quiz = useSelector((state) => state.quiz);
  const dispatch = useDispatch();

  const [isQuizLoading, setQuizLoadingStatus] = useState();

  useEffect(() => {
    if (quizId) {
      setQuizLoadingStatus(true);
      (async () => {
        const res = await getMyQuiz(quizId);
        dispatch(
          addQuizToQuizstore({
            quizName: res?.results?.[0]?.quizName,
            quizId,
            slides: res?.results?.[0]?.slides || []
          })
        );
        setQuizLoadingStatus(false);
      })();
    }
  }, [quizId]);

  const slidesLength =
    (quiz?.slides?.[quizId] && Object.keys(quiz?.slides?.[quizId])?.length) ||
    0;

  return (
    <>
      {isQuizLoading && (
        <div className="h-70vh flex justify-center items-center">
          <BounceLoader size="60" color="#6366f1" />
        </div>
      )}
      {slidesLength > 0 && !isQuizLoading && <CreateQuiz isCreate={false} />}
      {!slidesLength && !isQuizLoading && (
        <div className="h-70vh flex justify-center items-center">
          <EmptyState
            icon={<LightBulbIcon className="h-6 w-6 text-gray-400" />}
            msg="Unable to load the quiz, please try again later"
          />
        </div>
      )}
    </>
  );
};

export default EditQuiz;
