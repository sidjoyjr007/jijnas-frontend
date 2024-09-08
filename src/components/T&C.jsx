const TermsAndCondtions = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-300">
      <h1 className="text-4xl font-bold text-center mb-8">QuizNex Policies</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">1. Terms and Conditions</h2>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Introduction</h3>
          <p className="text-lg mt-2">
            Welcome to QuizNex. By accessing or using our website, you agree to
            be bound by these Terms and Conditions. Please read them carefully
            before using our services.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Use of Website</h3>
          <p className="text-lg mt-2">
            You agree to use QuizNex only for lawful purposes. You must not use
            our website in any way that breaches any applicable local, national,
            or international law or regulation.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Intellectual Property</h3>
          <p className="text-lg mt-2">
            All content on QuizNex, including text, graphics, logos, and images,
            is the property of QuizNex or its content suppliers and is protected
            by applicable intellectual property laws.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">User Account</h3>
          <p className="text-lg mt-2">
            You are responsible for maintaining the confidentiality of your
            account and password and for restricting access to your computer.
            You agree to accept responsibility for all activities that occur
            under your account or password.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Token Purchase and Usage</h3>
          <p className="text-lg mt-2">
            QuizNex offers credits that users must purchase to generate quizzes
            via AI or to create and host quiz events. Credits are non-refundable
            and must be used within the specified period, as indicated on the
            purchase page. Misuse of credits or attempts to exploit the system
            will result in account suspension or termination.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Limitations of Liability</h3>
          <p className="text-lg mt-2">
            QuizNex will not be held liable for any loss or damage arising from
            the use of our services, including any indirect, incidental, or
            consequential damages.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">2. Privacy Policy</h2>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Information Collection</h3>
          <p className="text-lg mt-2">
            We collect information that you provide directly to us when you
            create an account, purchase credits, or use our services. This may
            include your name, email address, payment information, and any other
            information you choose to provide.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Use of Information</h3>
          <p className="text-lg mt-2">
            We use the information we collect to provide, maintain, and improve
            our services, to process transactions, and to send you
            communications related to your account and our services.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Data Security</h3>
          <p className="text-lg mt-2">
            We implement appropriate technical and organizational measures to
            protect your personal data from unauthorized access, use, or
            disclosure.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Third-Party Services</h3>
          <p className="text-lg mt-2">
            We may share your information with third-party service providers who
            assist us in operating our website and conducting our business.
            These third parties are obligated to protect your information and
            only use it for the purposes for which it was disclosed.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">
          3. Refunds/Cancellations Policy
        </h2>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Refunds</h3>
          <p className="text-lg mt-2">
            Refunds for token purchases will only be granted under exceptional
            circumstances, such as accidental duplicate purchases. All refund
            requests must be submitted within 7 days of the purchase date. Once
            approved, refunds will be processed and credited to the customer's
            bank account within 5-7 working days.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Cancellations</h3>
          <p className="text-lg mt-2">
            You may cancel your QuizNex account at any time. However, please
            note that any unused credits at the time of cancellation will not be
            refunded.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">4. Pricing</h2>
        <p className="text-lg mt-2">
          All prices for credits and services on QuizNex are listed in Indian
          Rupees (INR) / USD. Prices are subject to change without notice, but
          any changes will not affect orders that have already been placed.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">5. Contact Us</h2>
        <p className="text-lg mt-2">
          If you have any questions or concerns about these policies or need
          assistance, please contact us:
        </p>
        <ul className="text-lg mt-2 list-disc list-inside">
          <li>
            <strong>Email:</strong> services@quiznex.com
          </li>
          {/* <li>
            <strong>Phone:</strong> 7619410706
          </li>
          <li>
            <strong>Address:</strong> #8, 3rd cross Manujnath Layout Marathalli
            - 560037
          </li> */}
        </ul>
      </section>
    </div>
  );
};

export default TermsAndCondtions;
