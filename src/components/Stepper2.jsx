const steps = [
  { name: "Step 1", href: "#", status: "complete" },
  { name: "Step 2", href: "#", status: "current" },
  { name: "Step 3", href: "#", status: "upcoming" },
  { name: "Step 4", href: "#", status: "upcoming" }
];

const Stepper2 = ({ steps, onStepperClick, currentId }) => {
  return (
    <nav aria-label="Progress" className="flex items-center justify-center">
      <p className="text-sm font-medium text-gray-200">
        Step {steps.findIndex((step) => step.id === currentId) + 1} of{" "}
        {steps.length}
      </p>
      <ol role="list" className="ml-8 flex items-center space-x-5">
        {steps.map((step) => (
          <li
            key={step.id}
            onClick={() => onStepperClick(step.id)}
            className="cursor-pointer"
          >
            {step.status === "complete" ? (
              <a
                href={step.href}
                className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900"
              >
                <span className="sr-only">{step.name}</span>
              </a>
            ) : step.id === currentId ? (
              <a
                href={step.href}
                aria-current="step"
                className="relative flex items-center justify-center"
              >
                <span aria-hidden="true" className="absolute flex h-5 w-5 p-px">
                  <span className="h-full w-full rounded-full bg-indigo-200" />
                </span>
                <span
                  aria-hidden="true"
                  className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                />
                <span className="sr-only">{step.name}</span>
              </a>
            ) : (
              <a
                href={step.href}
                className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400"
              >
                <span className="sr-only">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper2;