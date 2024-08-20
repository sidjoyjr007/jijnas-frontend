import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const SidePanel = ({
  content,
  sidePanelTitle,
  sidePanelDescription = "",
  handleSubmit = undefined,
  handleClose = undefined,
  open = false,
  setOpen = () => {}
}) => {
  return (
    <Dialog open={open} onClose={setOpen} className="relative ">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden z-50 shadow-md">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-3xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <form className="flex h-full flex-col overflow-y-scroll bg-gray-900 shadow-xl">
                <div className="flex-1">
                  {/* Header */}
                  <div className="bg-gray-700/10 px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between space-x-3">
                      <div className="space-y-1">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-200">
                          {sidePanelTitle}
                        </DialogTitle>
                        {sidePanelDescription && (
                          <p className="text-sm text-gray-500">
                            {sidePanelDescription}
                          </p>
                        )}
                      </div>
                      <div className="flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => {
                            handleClose();
                            setOpen(false);
                          }}
                          className="relative text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Divider container */}
                  <div className="space-y-6 p-6 sm:space-y-0 sm:divide-y  sm:divide-gray-200 sm:py-0">
                    <div className="space-y-2 px-4  sm:space-y-0 sm:px-6 sm:py-5">
                      {content}
                    </div>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SidePanel;
