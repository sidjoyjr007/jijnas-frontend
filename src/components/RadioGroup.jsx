"use client";

import { useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";

const settings = [
  {
    id: "immediately",
    name: "Submit Immediately",
    description:
      "User needs to submit after answering every question, once submitted user will not able to change answer again, answer explanation will be avilable once user submits"
  },
  {
    id: "save",
    name: "Save for later",
    description:
      "User will be able save/skip answers, and can revisit any question at any time before final submission"
  }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RadioGroupComponent = () => {
  const [selected, setSelected] = useState(settings[0]);

  return (
    <fieldset aria-label="Privacy setting">
      <RadioGroup
        value={selected}
        onChange={setSelected}
        className="-space-y-px rounded-md bg-white"
      >
        {settings.map((setting, settingIdx) => (
          <Radio
            key={setting.name}
            value={setting}
            aria-label={setting.name}
            aria-description={setting.description}
            className={classNames(
              settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
              settingIdx === settings.length - 1
                ? "rounded-bl-md rounded-br-md"
                : "",
              "group relative flex cursor-pointer border border-gray-200 p-4 focus:outline-none data-[checked]:z-10 data-[checked]:border-indigo-200 data-[checked]:bg-indigo-50"
            )}
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white group-data-[checked]:border-transparent group-data-[checked]:bg-indigo-600 group-data-[focus]:ring-2 group-data-[focus]:ring-indigo-600 group-data-[focus]:ring-offset-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="ml-3 flex flex-col">
              <span className="block text-sm font-medium text-gray-900 group-data-[checked]:text-indigo-900">
                {setting.name}
              </span>
              <span className="block text-sm text-gray-500 group-data-[checked]:text-indigo-700">
                {setting.description}
              </span>
            </span>
          </Radio>
        ))}
      </RadioGroup>
    </fieldset>
  );
};

export default RadioGroupComponent;