import {
  Bars4Icon,
  LightBulbIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const EmptyState = ({ setCurrentStep }) => {
  const items = [
    {
      title: "Add Question",
      description: "Add question for the current quiz.",
      icon: LightBulbIcon,
      background: "bg-pink-500",
      onclick: () => setCurrentStep("01")
    },
    {
      title: "Add Options",
      description: "Stay on top of your deadlines, or don’t — it’s up to you.",
      icon: Bars4Icon,
      background: "bg-yellow-500",
      onclick: () => setCurrentStep("02")
    },
    {
      title: "Add explanation",
      description: "Add answer explanation for the question, this is optional",
      icon: BookOpenIcon,
      background: "bg-green-500",
      onclick: () => setCurrentStep("03")
    }
  ];
  return (
    <div className="overflow-hidden">
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Nothing to preview
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        You haven’t added any question, options, and explanation to preview.
      </p>
      <ul
        role="list"
        className="mt-6 grid grid-cols-1 gap-6 border-b border-t border-white/5 py-6 sm:grid-cols-2"
      >
        {items.map((item, itemIdx) => (
          <li key={itemIdx} className="flow-root" onClick={item.onclick}>
            <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
              <div
                className={classNames(
                  item.background,
                  "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg"
                )}
              >
                <item.icon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  <a href="#" className="focus:outline-none">
                    <span aria-hidden="true" className="absolute inset-0" />
                    <span>{item.title}</span>
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmptyState;
