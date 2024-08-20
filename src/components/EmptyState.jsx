const EmptyState = ({ msg, onBtnClick = undefined, icon, ...rest }) => {
  return (
    <div onClick={() => onBtnClick && onBtnClick()} {...rest}>
      <button
        type="button"
        className="relative block w-full rounded-lg border-2 border-dashed border-gray-400 p-12 text-center hover:border-gray-400 "
      >
        <div className="flex flex-col justify-center items-center">
          <div>{icon}</div>
          <div className="mt-2 block text-sm font-semibold text-gray-400">
            {msg}
          </div>
        </div>
      </button>
    </div>
  );
};

export default EmptyState;
