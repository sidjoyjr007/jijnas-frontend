import { BeatLoader } from "react-spinners";

const Button = ({
  handleSubmit,
  isBtnDisabled = false,
  variant = "primary",
  label = "",
  isLoading = false,
  icon = undefined
}) => {
  const className =
    "flex w-full min-w-24 text-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-600";

  const getClassName = () => {
    if (variant === "primary") {
      return `${className} bg-indigo-600 focus-visible:outline-offset-2
    focus-visible:outline-indigo-600`;
    }

    return `${className} bg-white/10  focus-visible:outline-offset-2
    focus-visible:outline-white/10`;
  };

  return (
    <button
      onClick={() => handleSubmit()}
      disabled={isBtnDisabled || isLoading}
      className={getClassName()}
    >
      <div className="flex justify-center gap-2 items-center">
        {isLoading && <BeatLoader size="12" />}
        {icon && icon}
        {!isLoading && label}
      </div>
    </button>
  );
};

export default Button;
