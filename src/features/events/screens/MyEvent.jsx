import { useMemo, useEffect, useState } from "react";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addEventToEventList } from "../../../state/quiz.slice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PlusIcon,
  ArrowPathIcon
} from "@heroicons/react/20/solid";
import { copyToClipBoard } from "../../../utils/constant";
import TextInput from "../../../components/TextInput";
import { BounceLoader } from "react-spinners";
import Button from "../../../components/Button";
import { useNotification } from "../../../context/Notification.context";
import axiosInstance from "../../../utils/axios-config.utils";
import { STATUS, getEventStatus } from "../../../utils/local.utils";

const MyEvents = () => {
  const navigate = useNavigate();
  const quiz = useSelector((state) => state.quiz);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const [searchValue, setSearchValue] = useState("");
  const [isQuizLoading, setQuizLoadingStatus] = useState(false);
  const [refreshEventList, setRefreshStatus] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setQuizLoadingStatus(true);
      try {
        const res = await axiosInstance.get(
          `/api/v1/quiz/my-events?userId=${user?.userId}`
        );
        if (res.status === 200) {
          let newData = [];
          if (res?.data?.result?.length) {
            newData = res?.data?.result?.map((event) => {
              const status = getEventStatus(
                event?.startTime,
                parseInt(event?.timings)
              );
              return { ...event, status };
            });
          }
          dispatch(addEventToEventList({ data: newData }));
          return;
        }
        showNotification("Error", res?.data?.message, "alert");
      } catch (err) {
        showNotification("Error", err.response?.data.message, "alert");
      } finally {
        setQuizLoadingStatus(false);
      }
    };

    if (!quiz?.isMyEventsVisted || refreshEventList) {
      fetchEvents();
    }
  }, [refreshEventList]);

  const copyLink = async (url) => {
    const res = await copyToClipBoard(url);
    if (res) {
      showNotification("Success", "Link copied successfully", "success");
      return;
    }
    showNotification("Error", "Unable to copy link", "alert");
  };

  const columns = useMemo(() => {
    return [
      {
        id: "eventName",
        header: "Event Name",
        accessorKey: "eventName",
        filterFn: "includesStringSensitive"
      },
      {
        id: "quiz",
        header: "Quiz",
        accessorKey: "quizId.label",
        cell: ({ row }) => (
          <Link
            to={`/app/my-quizzes/${row?.original?.quizId?.id}`}
            state={{ currentQuizName: row?.original?.quizIName }}
            className="text-indigo-500 font-medium"
          >
            {row?.original?.quizId?.label || ""}
          </Link>
        )
      },
      {
        id: "duration",
        header: "Duration",
        accessorKey: "timing",
        cell: ({ row }) => <span>{row?.original?.timing} Mins</span>
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = getEventStatus(
            row?.original?.startTime,
            parseInt(row?.original?.timing)
          );
          if (status === "Not Started") return "-";
          const color =
            status === "Started" ? "fill-blue-400" : "fill-green-400";
          return (
            <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-800">
              <svg
                viewBox="0 0 6 6"
                aria-hidden="true"
                className={`h-1.5 w-1.5 ${color}`}
              >
                <circle r={3} cx={3} cy={3} />
              </svg>
              {status}
            </span>
          );
        }
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const status = getEventStatus(
            row?.original?.startTime,
            parseInt(row?.original?.timing)
          );
          return (
            <div className="flex items-center justify-end gap-x-2 cursor-pointer">
              <span
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer"
                onClick={() =>
                  copyLink(
                    `${window.location.origin}/quiz-event/${row?.original?.eventId}`
                  )
                }
              >
                Copy link{" "}
              </span>
              {status === STATUS.COMPLETED && (
                <Menu as="div" className="relative ">
                  <MenuButton
                    disabled={row?.original?.status === "STARTED"}
                    className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500 "
                  >
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
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
                        to={`/app/events/${row?.original?.eventId}`}
                        state={{ eventData: row?.original }}
                        className="block px-3 py-1 text-sm leading-6 text-gray-400 data-[focus]:bg-white/15"
                      >
                        Results
                      </Link>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              )}
            </div>
          );
        }
      }
    ];
  }, []);

  return (
    <>
      {isQuizLoading && (
        <div className="h-70vh flex justify-center items-center">
          <BounceLoader size="60" color="#6366f1" />
        </div>
      )}
      {!isQuizLoading && (
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-row flex-wrap justify-end mb-4 items-center gap-4">
            <div onClick={() => setRefreshStatus((prevState) => !prevState)}>
              <ArrowPathIcon className="h-8 w-8 text-gray-300 cursor-pointer" />
            </div>
            <div>
              <TextInput
                placeholder="Search Events"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={!quiz?.events?.length}
              />
            </div>
            <div>
              <Button
                label="Create Event"
                handleSubmit={() => navigate("/app/events/create-event")}
                icon={<PlusIcon className="h-6 w-6" />}
              />
            </div>
          </div>
          <Table
            columns={columns}
            data={quiz?.events || []}
            searchValue={searchValue}
            emptyMsg="No events found"
          />
        </div>
      )}
    </>
  );
};

export default MyEvents;
