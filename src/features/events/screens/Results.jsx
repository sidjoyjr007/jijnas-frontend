import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { CSVLink } from "react-csv";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import axiosInstance from "../../../utils/axios-config.utils";
import { useNotification } from "../../../context/Notification.context";
import Table from "../../../components/Table";
import { getTimeDifference } from "../../../utils/local.utils";
import Button from "../../../components/Button";
const Results = () => {
  const { eventId } = useParams();
  const [isResultsLoading, setLoadingStatus] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const { showNotification } = useNotification();
  const location = useLocation();
  const { state } = location;

  const getFinishTime = (finishTime) => {
    if (!finishTime) return `${parseInt(state?.eventData?.timing)} minutes`;
    else {
      const { minutes, seconds } = getTimeDifference(
        finishTime,
        state?.eventData?.startTime
      );
      return `${minutes} minutes ${seconds} seconds`;
    }
  };

  const columns = useMemo(() => {
    return [
      {
        id: "rank",
        cell: ({ row }) => `#${row?.index + 1}`
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        filterFn: "includesStringSensitive"
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email"
      },
      ...(state?.eventData?.additionalInfo
        ? [
            {
              id: "additionalInfo",
              header: state?.eventData?.additionalInfo,
              accessorKey: "additionalInfo"
            }
          ]
        : []),

      {
        id: "score",
        header: "Score",
        accessorKey: "rightAnswers",
        cell: ({ row }) => row?.original?.rightAnswers || 0
      },
      {
        id: "finishTime",
        header: "Finish Time",
        accessorKey: "finishTime",
        cell: ({ row }) => {
          return getFinishTime(row?.original?.finishTime);
        }
      }
    ];
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingStatus(true);
        const res = await axiosInstance.get(
          `/api/v1/quiz/event-result?eventId=${eventId}`
        );
        if (res?.status === 200) {
          const resultData = res?.data?.resultData;
          const csvData = [];
          const colHeaders = columns?.map((column) => column?.header)?.slice(1);
          csvData?.push(colHeaders);
          resultData?.forEach((data) => {
            const eachRow = [data?.name, data?.email];
            if (state?.eventData?.additionalInfo)
              eachRow?.push(data?.additionalInfo);
            eachRow.push(
              ...[data?.rightAnswers || 0, getFinishTime(data?.finishTime)]
            );
            csvData?.push(eachRow);
          });
          setCSVData(csvData);
          setResultData(resultData);
          return;
        }
        showNotification("Error", res?.data?.message, "alert");
      } catch (err) {
        showNotification("Error", err.response?.data.message, "alert");
      } finally {
        setLoadingStatus(false);
      }
    })();
  }, [eventId]);

  return (
    <>
      {isResultsLoading && (
        <div className="h-70vh flex justify-center items-center">
          <BounceLoader size="60" color="#6366f1" />
        </div>
      )}

      {!isResultsLoading && (
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end m-4 cursor-pointer">
            <CSVLink
              data={csvData}
              target="_blank"
              filename={`Results_for_event_${eventId}`}
            >
              <Button label="Download CSV" />
            </CSVLink>
          </div>
          <Table
            columns={columns}
            data={resultData}
            emptyMsg="No results found"
          />
        </div>
      )}
    </>
  );
};

export default Results;
