import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div
      id="error-page"
      className="h-screen w-full flex  flex-col justify-center items-center"
    >
      <h1 className="text-xl font-medium text-gray-400">Oops!</h1>
      <p className="text-md text-gray-400">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="text-md font-medium text-gray-200">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
