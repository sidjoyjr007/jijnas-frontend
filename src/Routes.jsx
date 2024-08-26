import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Suspense, useState, lazy } from "react";
import { useEffect } from "react";
import { BounceLoader } from "react-spinners";

const App = lazy(() => import("./App"));
const CreateQuiz = lazy(() =>
  import("./features/create-quiz/screens/CreateQuiz")
);
const Login = lazy(() => import("./features/auth/screens/Login"));
const LandingPage = lazy(() =>
  import("./features/landing-page/screens/LandingPage")
);
const Signup = lazy(() => import("./features/auth/screens/Signup"));
const VerifyEmail = lazy(() => import("./features/auth/screens/VerifyEmail"));
const MyQuizzes = lazy(() => import("./features/my-quizes/screens/MyQuizzes"));
const EditQuiz = lazy(() => import("./features/my-quizes/screens/EditQuiz"));
const PreviewAll = lazy(() => import("./components/PreviewAll"));
const CreateEvent = lazy(() => import("./features/events/screens/CreateEvent"));
const MyEvents = lazy(() => import("./features/events/screens/MyEvent"));
const Subscription = lazy(() =>
  import("./features/subscription/screens/Subscription")
);
const AIQuiz = lazy(() => import("./features/ai/screens/AIQuiz"));
const QuizEvent = lazy(() => import("./features/events/screens/QuizEvent"));
const Results = lazy(() => import("./features/events/screens/Results"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));
const TermsAndConditions = lazy(() => import("./components/T&C"));

import { signedup } from "./state/user.slice";
import axiosInstance from "./utils/axios-config.utils";

const WrappedRoutes = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userLoading, setUserLoading] = useState(false);

  const verifyUserDetails = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/users/user-details");
      return res;
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    setUserLoading(true);
    (async () => {
      try {
        const res = await verifyUserDetails();
        if (res?.status === 200) {
          dispatch(signedup({ data: res?.data?.userDetails || {} }));
          return;
        }
      } catch (err) {
        console.log(err);
      } finally {
        setUserLoading(false);
      }
    })();
  }, []);

  const ProtectedLoader = ({ component }) => {
    if ((!user?.isLoggedIn && !user?.isLoading) || !user?.verified) {
      return <Navigate to="/auth/login" />;
    }
    return component;
  };

  const loginLoader = () => {
    if (user?.isLoggedIn && user.verified) {
      return redirect("/app/my-quizzes");
    }
    return null;
  };

  const routes = createBrowserRouter([
    {
      id: "root",
      path: "/",
      element: <LandingPage />,
      errorElement: <ErrorPage />
    },
    {
      path: "/app",
      element: <App />,
      children: [
        {
          index: true,
          path: "/app/my-quizzes",
          element: <ProtectedLoader component={<MyQuizzes />} />
        },
        {
          path: "/app/create-quiz",
          element: <ProtectedLoader component={<CreateQuiz />} />
        },
        {
          path: "/app/my-quizzes/:quizId",
          element: <ProtectedLoader component={<EditQuiz />} />
        },
        {
          path: "/app/ai-quiz",
          element: <ProtectedLoader component={<AIQuiz />} />
        },
        {
          path: "/app/events",
          element: <ProtectedLoader component={<MyEvents />} />
        },
        {
          path: "/app/events/create-event",
          element: <ProtectedLoader component={<CreateEvent />} />
        },
        {
          path: "/app/events/:eventId",
          element: <ProtectedLoader component={<Results />} />
        },
        {
          path: "/app/tokens",
          element: <ProtectedLoader component={<Subscription />} />
        }
      ]
    },
    {
      path: "/preview/:quizId",
      element: <PreviewAll />
    },
    {
      path: "/quiz-event/:eventId",
      element: <QuizEvent />
    },
    {
      path: "/auth/login",
      loader: loginLoader,
      element: <Login />
    },
    {
      path: "/auth/signup",
      loader: loginLoader,
      element: <Signup />
    },
    {
      path: "/auth/forgot-password",
      element: <VerifyEmail isFpc />
    },
    {
      path: "/logout",
      action() {
        return redirect("/");
      }
    },
    {
      path: "/TandC",
      element: <TermsAndConditions />
    }
  ]);

  return (
    <div className="w-full h-full">
      {userLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <BounceLoader size="60" color="#6366f1" />
        </div>
      ) : (
        <Suspense
          fallback={<p className="text-xl text-gray-300">Loading...</p>}
        >
          <RouterProvider router={routes} />
        </Suspense>
      )}
    </div>
  );
};

export default WrappedRoutes;
