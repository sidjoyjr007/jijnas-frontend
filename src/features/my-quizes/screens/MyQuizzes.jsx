import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BounceLoader } from "react-spinners";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/20/solid";

import QuizCard from "../components/QuizCard";
import { getMyQuizzes } from "../../../actions/quiz.actions";
import { addQuizToQuizList } from "../../../state/quiz.slice";
import EmptyState from "../../../components/EmptyState";
import TextInput from "../../../components/TextInput";
import Button from "../../../components/Button";

const MyQuizzes = () => {
  const quiz = useSelector((state) => state.quiz);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quizSearchValue, setQuizSearchValue] = useState("");
  const [quizList, setQuizList] = useState([]);
  const [isQuizLoading, setQuizLoadingStatus] = useState(false);
  const [refreshQuizList, setRefreshStatus] = useState(false);

  useEffect(() => {
    setQuizLoadingStatus(true);
    (async () => {
      console.log("getting quiz");
      const res = await getMyQuizzes(user?.userId);
      dispatch(addQuizToQuizList({ data: res?.result || [] }));
      setQuizList(res?.result);
      setQuizLoadingStatus(false);
    })();
  }, [refreshQuizList]);

  useEffect(() => {
    if (!quizSearchValue) setQuizList(quiz?.quizList);
    else {
      const filteredQuizzes = quiz?.quizList?.filter((item) =>
        item.quizName.toLowerCase().includes(quizSearchValue.toLowerCase())
      );
      setQuizList(filteredQuizzes);
    }
  }, [quizSearchValue]);

  return (
    <>
      {isQuizLoading && (
        <div className="h-70vh flex justify-center items-center">
          <BounceLoader size="60" color="#6366f1" />
        </div>
      )}
      {quiz?.quizList?.length > 0 && !isQuizLoading && (
        <div className="px-4 py-4 rounded-lg   h-full">
          <div className="flex flex-row justify-end mb-4 items-center gap-4">
            <div>
              <TextInput
                placeholder="Search your quizzes"
                onChange={(e) => setQuizSearchValue(e.target.value)}
                value={quizSearchValue}
              />
            </div>
            <div>
              <Button
                handleSubmit={() => navigate("/app/create-quiz")}
                label="Create Quiz"
                icon={<PlusIcon className="h-6 w-6" />}
              />
            </div>
          </div>
          <QuizCard quizList={quizList} setRefreshStatus={setRefreshStatus} />
        </div>
      )}

      {!quizList?.length && !isQuizLoading && (
        <div className="h-70vh flex justify-center items-center">
          <EmptyState
            onBtnClick={() => navigate("/app/create-quiz")}
            icon={<LightBulbIcon className="h-6 w-6 text-gray-400" />}
            msg="Quizzes not found, create one"
          />
        </div>
      )}
    </>
  );
};

export default MyQuizzes;
