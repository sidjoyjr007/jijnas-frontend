/* eslint-disable react/jsx-key */
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from "@heroicons/react/20/solid";
import { rankItem } from "@tanstack/match-sorter-utils";

import TextInput from "./TextInput";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
const Table = ({ columns, data, searchValue = "", emptyMsg = "" }) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const columnResizeMode = "onChange";
  const columnResizeDirection = "ltr";
  const {
    getHeaderGroups,
    getRowModel,
    getState,
    setPageIndex,
    getCanPreviousPage,
    getPageCount,
    getCanNextPage,
    previousPage,
    nextPage,
    setPageSize,
    getAllLeafColumns,
    options,
    getCenterTotalSize
  } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode,
    columnResizeDirection,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    filterFns: {
      fuzzy: fuzzyFilter //define as a filter function that can be used in column definitions
    },
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getFilteredRowModel: getFilteredRowModel()
  });

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    setGlobalFilter(searchValue);
  }, [searchValue]);

  return (
    <>
      <div className="mt-2">
        <div className=" ring-1 ring-white/5 sm:mx-0 sm:rounded-lg max-h-65vh  overflow-auto">
          <table className="min-w-full divide-y divide-white/5 ">
            {data?.length > 0 ? (
              <>
                <thead className="bg-gray-800/30 sticky top-0 z-50 shadow-sm">
                  {getHeaderGroups()?.map((headerGroup) => (
                    <tr key={headerGroup?.id}>
                      {headerGroup?.headers.map((header) => (
                        <th
                          {...{
                            key: header.id,
                            colSpan: header.colSpan,
                            style: {
                              width: header.getSize()
                            },
                            className:
                              "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-400 sm:pl-6 bg-gray-800/30"
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          <div
                            {...{
                              onDoubleClick: () => header.column.resetSize(),
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              className: `resizer ${
                                options.columnResizeDirection
                              } ${
                                header.column.getIsResizing()
                                  ? "isResizing"
                                  : ""
                              }`,
                              style: {
                                transform:
                                  columnResizeMode === "onEnd" &&
                                  header.column.getIsResizing()
                                    ? `translateX(${
                                        (options.columnResizeDirection === "rtl"
                                          ? -1
                                          : 1) *
                                        (getState().columnSizingInfo
                                          .deltaOffset ?? 0)
                                      }px)`
                                    : ""
                              }
                            }}
                          />
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {getRowModel()?.rows?.map((row, rowIdx) => (
                    <tr key={row?.id} className="p-3 relative">
                      {row?.getVisibleCells()?.map((cell) => (
                        <td
                          {...{
                            key: cell.id,
                            style: {
                              width: cell.column.getSize()
                            }
                          }}
                          className={classNames(
                            rowIdx === 0 ? "" : "border-t border-white/5",
                            "relative py-4 pl-4 pr-3 text-sm sm:pl-6 font-medium text-gray-400"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <div className="mt-12 flex justify-center items-center h-full text-gray-300">
                {emptyMsg}
              </div>
            )}
          </table>
        </div>

        {data?.length > 10 && (
          <div className="flex items-center  justify-end mt-4 gap-2">
            <span className="isolate inline-flex rounded-md shadow-sm">
              <span className="flex items-center gap-1 mr-2">
                <div className="text-md font-medium text-gray-400">Page</div>
                <div className="text-md font-medium text-gray-400 ">
                  {getState().pagination.pageIndex + 1} of {getPageCount()}
                </div>
              </span>
              <button
                onClick={() => setPageIndex(0)}
                disabled={!getCanPreviousPage()}
                type="button"
                className="relative inline-flex items-center rounded-l-md border-white/5 bg-transparent px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-gray-700/10 focus:z-10"
              >
                <span className="sr-only">Previous</span>
                <ChevronDoubleLeftIcon aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!getCanPreviousPage()}
                type="button"
                className="relative inline-flex items-center border-white/5 bg-transparent px-2 py-2 text-gray-400 ring-1 ring-inset  ring-white/10 hover:bg-gray-700/10 focus:z-10"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!getCanNextPage()}
                type="button"
                className="relative inline-flex items-center  border-white/5 bg-transparent px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-gray-700/10 focus:z-10"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
              </button>

              <button
                onClick={() => setPageIndex(getPageCount() - 1)}
                disabled={!getCanNextPage()}
                type="button"
                className="relative inline-flex items-center rounded-r-md border-white/5 bg-transparent px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-gray-700/10 focus:z-10"
              >
                <span className="sr-only">Next</span>
                <ChevronDoubleRightIcon
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </button>
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
