import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/20/solid";
import moment from "moment";
import { useNavigate, Link } from "react-router-dom";

import AlertDialog from "../../../components/AlertDilaog";
import axiosInstance from "../../../utils/axios-config.utils";
import { useNotification } from "../../../context/Notification.context";
import { utcToLocal } from "../../../utils/local.utils";

const getMenuItem = (Icon, text) => {
  return (
    <div className="flex gap-x-2 items-center">
      <Icon className="h-4 w-4" />
      <span>{text}</span>
    </div>
  );
};

const QuizCard = ({ quizList = [], setRefreshStatus }) => {
  const navigation = useNavigate();
  const [dialogData, setDialogData] = useState({});
  const [deleteQuizId, setDeleteQuizId] = useState("");
  const { showNotification } = useNotification();

  const onAlertDialogClose = () => {
    setDialogData({ show: false });
  };

  const deleteQuiz = async () => {
    setDialogData({ show: false });
    try {
      const res = await axiosInstance.get(
        `/api/v1/quiz/delete-quiz?quizId=${deleteQuizId}`
      );
      if (res.status === 200) {
        showNotification("Success", res?.data?.message, "success");
        setRefreshStatus((prevState) => !prevState);
        return;
      }
      showNotification("Error", res?.data?.message, "alert");
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    }
  };

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2  2xl:grid-cols-4 xl:gap-x-8"
      >
        {quizList.map((quiz) => (
          <li
            key={quiz?.quizId}
            className="overflow-hidden rounded-xl border border-white/5 "
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-700/10 p-6">
              <div
                onClick={() => navigation(`/app/my-quizzes/${quiz.quizId}`)}
                className={`flex justify-center items-center h-12 w-12 flex-none rounded-lg bg-indigo-100 object-cover ring-1 ring-indigo-900/10 cursor-pointer`}
              >
                <span className="font-bold text-2xl text-indigo-700">
                  {quiz.quizName
                    .split(" ")
                    .splice(0, 2)
                    .map((str) => str.charAt(0))
                    .join("")
                    .toUpperCase()}
                </span>
              </div>

              <div
                className="text-sm font-medium leading-6 text-gray-400 truncate"
                title={quiz?.quizName}
              >
                {quiz.quizName}
              </div>
              <Menu as="div" className="relative ml-auto ">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Open options</span>
                  <EllipsisHorizontalIcon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-gray-700 py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <Link
                      to={`/preview/${quiz.quizId}`}
                      target="_blank"
                      className="block px-3 py-1 text-sm leading-6 text-gray-400 data-[focus]:bg-white/15"
                    >
                      {getMenuItem(EyeIcon, "Preview")}
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to={`/app/my-quizzes/${quiz.quizId}`}
                      state={{
                        currentQuizName: quiz.quizName
                      }}
                      className="block px-3 py-1 text-sm leading-6 text-gray-400 data-[focus]:bg-white/15"
                    >
                      {getMenuItem(PencilIcon, "Edit")}
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <a
                      onClick={() => {
                        setDeleteQuizId(quiz?.quizId);
                        setDialogData({
                          show: true,
                          msgHeader: "Delete Quiz",
                          msg: "Deleting quiz, you will not able to do activities asscoiated with this quiz"
                        });
                      }}
                      className="cursor-pointer block px-3 py-1 text-sm leading-6 text-gray-400 data-[focus]:bg-white/15"
                    >
                      {getMenuItem(TrashIcon, "Delete")}
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
            <dl
              className="-my-3 divide-y divide-white/5 px-6 py-4 text-sm leading-6 cursor-pointer"
              onClick={() => navigation(`/app/my-quizzes/${quiz.quizId}`)}
            >
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-400">
                  <time dateTime={quiz.lastUpdated}>
                    {moment(utcToLocal(quiz.lastUpdated)).format(
                      "MMMM DD YYYY hh:mm A"
                    )}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Total Questions</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-400">
                    {quiz.totalQuestions}
                  </div>
                </dd>
              </div>
            </dl>
            {dialogData?.show && (
              <AlertDialog
                show={dialogData?.show}
                msgHeader={dialogData?.msgHeader}
                msg={dialogData?.msg}
                onClose={() => onAlertDialogClose()}
                onConfirm={() => deleteQuiz()}
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default QuizCard;
