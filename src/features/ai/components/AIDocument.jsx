import Button from "../../../components/Button";
import { DocumentPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import AlertDialog from "../../../components/AlertDilaog";
import { useSelector } from "react-redux";

const AIDocument = ({
  isDocumentSubmitted,
  handleDocumentBasedGeneration,
  file,
  onFileSelect
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const quiz = useSelector((state) => state?.quiz);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    const extensions = ["doc", "docx", "pdf", "txt", "md"];
    const files = e?.target?.files;

    if (files?.length) {
      const fileSize = files[0]?.size;
      const fileName = files[0]?.name;
      const extension = fileName
        .substring(fileName.lastIndexOf(".") + 1)
        .toLowerCase();
      if (fileSize > 3 * 1024 * 1024) {
        onFileSelect(null);
        setDialogData({
          show: true,
          msgHeader: "File size exceeded",
          msg: "Application supports file size max up to 3MB"
        });
      } else if (!extensions?.includes(extension)) {
        onFileSelect(null);
        setDialogData({
          show: true,
          msgHeader: "File extension not supported",
          msg: "Please upload file in one of the extensions DOC, DOCX, PDF, MD, TXT "
        });
      } else {
        onFileSelect(files[0]);
      }
    }
  };

  const handleFileSubmit = () => {
    handleDocumentBasedGeneration(file);
  };

  const onAlertDialogClose = () => {
    setDialogData({ show: false });
  };

  return (
    <div className="flex flex-col gap-y-4">
      {!file?.name && !quiz?.aiFile?.name && (
        <div className="col-span-full">
          <label
            htmlFor="cover-photo"
            className="block text-sm font-medium leading-6 text-white"
          >
            Upload Document
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10"
          >
            <div className="text-center">
              <DocumentPlusIcon
                aria-hidden="true"
                className="mx-auto h-12 w-12 text-gray-500"
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md  font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    onChange={handleFileChange}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-400">
                DOC, DOCX, PDF, MD, TXT up to 3MB
              </p>
            </div>
          </div>
          {dialogData?.show && (
            <AlertDialog
              show={dialogData?.show}
              msgHeader={dialogData?.msgHeader}
              msg={dialogData?.msg}
              onClose={() => onAlertDialogClose()}
            />
          )}
        </div>
      )}
      {(file || quiz?.aiFile?.name) && (
        <div className="flex justify-between bg-gray-600/10 rounded-md  px-4 py-4  border border-white/5 gap-y-4">
          <span className="text-gray-300 ">
            {file?.name || quiz?.aiFile?.name}
          </span>
          <XMarkIcon
            className="h-6 w-6 text-gray-300 cursor-pointer"
            onClick={() => onFileSelect(null)}
          />
        </div>
      )}

      <Button
        label="Generate"
        variant="secondary"
        isBtnDisabled={!file?.name && !quiz?.aiFile?.name}
        isLoading={isDocumentSubmitted}
        handleSubmit={handleFileSubmit}
      />
    </div>
  );
};

export default AIDocument;
