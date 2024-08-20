import { useState } from "react";
import {
  PlusIcon,
  TrophyIcon,
  LightBulbIcon,
  CpuChipIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

import { Outlet } from "react-router-dom";

import SideNavigation from "./components/SideNavigation";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import BreadCrum from "./components/BreadCrum";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "./utils/axios-config.utils";

const navigation = [
  {
    name: "Create Quiz",
    href: "/app/create-quiz",
    icon: PlusIcon
  },
  { name: "AI Quiz", href: "/app/ai-quiz", icon: CpuChipIcon },
  {
    name: "My Quizzes",
    href: "/app/my-quizzes",
    icon: LightBulbIcon
  },
  { name: "Events", href: "/app/events", icon: TrophyIcon },
  {
    name: "Tokens",
    href: "/app/tokens",
    icon: CurrencyDollarIcon
  }
];

const App = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutHandler = async () => {
    const logout = await axiosInstance.get("/api/v1/users/logout");
    if (logout.status === 200) {
      dispatch({ type: "RESET" });
    }
  };

  const profileActions = [{ name: "Sign out", onClick: logoutHandler }];

  return (
    <div className="h-screen relative isolate overflow-x-hidden">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
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
      <SideNavigation
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="xl:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-gray-900/20 px-4 shadow-sm  sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 xl:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div
            aria-hidden="true"
            className="h-6 w-px bg-gray-900/10 lg:hidden"
          />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
            <div className="flex items-center gap-x-4 lg:gap-x-6 ">
              <BreadCrum />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 ">
              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="h-6 w-6 text-gray-400" />
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      aria-hidden="true"
                      className="ml-4 text-sm font-semibold leading-6 text-gray-200"
                    >
                      {user.userName || ""}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 text-gray-400"
                    />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-gray-700 py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {profileActions.map((item) => (
                    <MenuItem key={item.name}>
                      <a
                        onClick={item.onClick}
                        className="block px-3 py-1 text-sm leading-6 text-gray-400 data-[focus]:bg-white/15 cursor-pointer"
                      >
                        {item.name}
                      </a>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <main className=" box-border xl:pl-72 rounded-lg   ">
        <div className="   	">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default App;
