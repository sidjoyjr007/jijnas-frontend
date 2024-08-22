import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const Textarea = ({
  label,
  placeholder = "",
  value = "",
  defaultValue = "",
  err,
  name,
  id,
  ...rest
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-white"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <textarea
          placeholder={placeholder}
          id={id}
          value={value}
          name={name}
          rows={4}
          className="block w-full rounded-md border-0 bg-white/5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6  "
          defaultValue={defaultValue}
          {...rest}
        />
        {err && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              aria-hidden="true"
              className="h-5 w-5 text-red-500"
            />
          </div>
        )}
      </div>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
    </div>
  );
};

export default Textarea;
