import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import OptionsList from "../../../components/OptionsList";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import EmptyState from "./EmptyState";

const Preview = ({
  questionModel,
  explaintionModel,
  options,
  setCurrentStep
}) => {
  return (
    <>
      {!questionModel && !explaintionModel && options?.length == 0 ? (
        <EmptyState setCurrentStep={setCurrentStep} />
      ) : (
        <div className=" border border-white/5  p-4 rounded-2xl bg-gray-700/10  ">
          <div className="mb-6 text-gray-400 ">
            <FroalaEditorView model={questionModel} />
          </div>
          <div className="text-gray-400 px-4">
            <OptionsList options={options} onOP />
          </div>
          <div>
            <Disclosure key="explanation" as="div">
              <h3>
                <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                  <span className="text-sm font-medium text-gray-400 group-data-[open]:text-indigo-600">
                    explanation
                  </span>
                  <span className="ml-6 flex items-center">
                    <PlusIcon
                      aria-hidden="true"
                      className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                    />
                    <MinusIcon
                      aria-hidden="true"
                      className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                    />
                  </span>
                </DisclosureButton>
              </h3>
              <DisclosurePanel className="prose prose-sm pb-6">
                <ul role="list" className="text-gray-600">
                  <FroalaEditorView model={explaintionModel} />
                </ul>
              </DisclosurePanel>
            </Disclosure>
          </div>
        </div>
      )}
    </>
  );
};

export default Preview;
