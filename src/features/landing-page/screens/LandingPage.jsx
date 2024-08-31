import {
  CalendarDaysIcon,
  LightBulbIcon,
  EyeIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import jijnasLogo from "../../../assets/logo.svg";
import Button from "../../../components/Button";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import TextInput from "../../../components/TextInput";
import { useState } from "react";
import { EMAIL_REGEX } from "../../../utils/constant";
import axiosInstance from "../../../utils/axios-config.utils";
import { useNotification } from "../../../context/Notification.context";
import LandingImage1 from "../../../assets/landing-image-1.png";
import LandingImage2 from "../../../assets/landing-image-2.png";

const primaryFeatures = [
  {
    name: "Create Quiz",
    description:
      "Create quizzes manually, let our AI generate them, or blend both for a customized experience effortlessly tailored to your needs.",
    icon: LightBulbIcon
  },
  {
    name: "Preview",
    description:
      "Wondering how your quizzes will appear to participants? Our preview mode lets you see it firsthand, and you can easily edit your quiz anytime after it's created.",
    icon: EyeIcon
  },
  {
    name: "Host Event",
    description:
      "Host a quiz event with any quiz you've created and easily share the event link with participants. Get a detailed performance report after the event.",
    href: "#",
    icon: CalendarDaysIcon
  }
];

const LandingPage = () => {
  const [email, setEmail] = useState({});
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleGetStarted = () => {
    if (!user?.loggedIn) {
      navigate("/auth/login");
    } else {
      navigate("/app/create-quiz");
    }
  };

  const handleEmailChange = (value) => {
    let err = "";
    if (!value) err = "Please Enter valid email";
    else if (!EMAIL_REGEX?.test(value)) err = "Please Enter valid email";

    setEmail({
      value,
      err
    });
  };

  const sendUserQuery = async () => {
    try {
      const res = await axiosInstance.post("/api/v1/contact", {
        email: email?.value
      });
      if (res.status === 200) {
        showNotification("Success", res?.data?.message, "success");
      }
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    } finally {
      setEmail({});
    }
  };

  return (
    <div className="bg-gray-900">
      <main>
        {/* Hero section */}
        <div className="relative isolate overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
          <div
            aria-hidden="true"
            className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)"
              }}
              className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 pb-24 pt-6 sm:pb-40 lg:flex lg:px-8 lg:pt-16">
            <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
              <img alt="Logo" src={jijnasLogo} className="w-20 h-20" />
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                From Manual to AI-Driven: Craft Quizzes and Host Events Like a
                Pro!
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Create custom quizzes manually or generate them with AI.
                Effortlessly host quiz events and get reports to track and
                analyze participant performance.
              </p>
              <div className="mt-6 flex items-center gap-x-6 max-w-52">
                <Button
                  label="Get Started"
                  handleSubmit={() => handleGetStarted()}
                  icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
                />
              </div>
            </div>
            <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
              <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                <img
                  alt="App screenshot"
                  src={LandingImage1}
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="mx-auto mt-6 max-w-7xl px-6 sm:mt-12 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">
              Creating to hosting quiz event
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need for your quiz
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {primaryFeatures.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                      <feature.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-white"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Feature section */}
        <div className="mt-32 sm:mt-56">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-400">
                One-Click Quiz Creation
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                No time? We got you.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Generate an entire quiz on any topic with just one click! Let AI
                do the work for you perfect for when you are short on time but
                still need quality, engaging questions.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden pt-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <img
                alt="App screenshot"
                src={LandingImage2}
                width={2432}
                height={1442}
                className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
              />
              <div aria-hidden="true" className="relative">
                <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-900 pt-[7%]" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
          <svg
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={0}
                id="1d4240dd-898f-445f-932d-e2872fd12de3"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={0} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          >
            <div
              style={{
                clipPath:
                  "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)"
              }}
              className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
            />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Got any queries
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Provide your mail id below, we will get back to you soon.
            </p>
            <div>
              <TextInput
                placeholder="Enter your mail id"
                value={email?.value}
                err={email?.err}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
            </div>
            <div className="mt-6 flex items-center justify-center gap-x-6">
              <button
                onClick={() => sendUserQuery()}
                disabled={email?.err}
                className="disabled:cursor-not-allowed  rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer aria-labelledby="footer-heading" className="relative">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
          <div className="border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
            <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
              &copy; {new Date().getFullYear()} QuizNex All rights, reserved.{" "}
              <Link
                to="/TandC"
                target="_blank"
                className="cursor-pointer text-indigo-600"
              >
                Terms and Conditions
              </Link>
            </p>
            <p className="text-gray-300">Contact us : jijnasinka@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
