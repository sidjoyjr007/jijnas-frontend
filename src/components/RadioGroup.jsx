import { Radio, RadioGroup } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RadioGroupComponent = ({ options = [], selectedOption, setOption }) => {
  return (
    <fieldset aria-label="Choose a memory option">
      <RadioGroup
        value={selectedOption}
        onChange={setOption}
        className="flex flex-row gap-x-4"
      >
        {options.map((option) => (
          <Radio
            key={option.name}
            value={option}
            className={classNames(
              selectedOption?.name === option?.name
                ? "bg-indigo-600"
                : "bg-white/5",
              "max-w-56 cursor-pointer focus:outline-none flex items-center justify-center rounded-md  px-3 py-3 text-sm font-semibold uppercase text-gray-300 ring-1 ring-gray-500 hover:bg-gray-700/10 data-[checked]:bg-indigo-600 data-[checked]:text-white data-[checked]:ring-0 data-[focus]:data-[checked]:ring-2 data-[focus]:ring-2 data-[focus]:ring-indigo-600 data-[focus]:ring-offset-2 data-[checked]:hover:bg-indigo-500 sm:flex-1 [&:not([data-focus],[data-checked])]:ring-inset"
            )}
          >
            <div className="flex gap-x-2 justify-center items-center">
              {option?.icon && <option.icon className="h-4 w-4" />}
              <span> {option.name}</span>
            </div>
          </Radio>
        ))}
      </RadioGroup>
    </fieldset>
  );
};

export default RadioGroupComponent;
