import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton
} from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "How many quizzes can I create with my account?",
    answer:
      "There are no restrictions on creating quizzes; you can create as many as you like."
  },
  {
    question: "Can I try the application before purchasing credits?",
    answer:
      "Yes, anyone who signs up for the first time will receive 150 credits, which can be used to explore the application."
  },
  {
    question: "What are credits used for?",
    answer:
      "Credits are used to generate AI quizzes and host events. For more information on token requirements, please visit the 'Credits' section."
  },
  {
    question: "How many credits are required to create a quiz?",
    answer:
      "No credits are required to create quizzes manually, but generating quizzes through AI requires credits. For more information on token requirements, please visit the 'Credits' section."
  },
  {
    question: "Are my credits refundable?",
    answer:
      "No, we follow a pay-as-you-go model. You can purchase credits only when needed."
  },
  {
    question: "What are events?",
    answer:
      "You can host a quiz event based on any quiz you have created on the platform and share the event link with participants."
  }
];

const Queries = () => {
  return (
    <div className="xl:px-48 2xl:px-72 h-full  px-4 py-6  ">
      <div className="mb-6 bg-gray-600/10 rounded-md  px-4 py-4 flex items-center justify-between ">
        <h2 className="text-xl font-medium leading-10 tracking-tight text-white">
          Contact us
        </h2>
        <div className="text-gray-300 space-x-2"> services@quiznex.com</div>
      </div>
      <div className="mx-auto max-w-4xl divide-y divide-white/10">
        <h2 className="text-xl font-bold leading-10 tracking-tight text-white">
          Frequently asked questions
        </h2>
        <dl className="mt-10 space-y-6 divide-y divide-white/10">
          {faqs.map((faq) => (
            <Disclosure key={faq.question} as="div" className="pt-6">
              <dt>
                <DisclosureButton className="group flex w-full items-start justify-between text-left text-white">
                  <span className="text-base font-semibold leading-7">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    <PlusIcon
                      aria-hidden="true"
                      className="h-6 w-6 group-data-[open]:hidden"
                    />
                    <MinusIcon
                      aria-hidden="true"
                      className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                    />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" className="mt-2 pr-12">
                <p className="text-base leading-7 text-gray-300">
                  {faq.answer}
                </p>
              </DisclosurePanel>
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default Queries;
