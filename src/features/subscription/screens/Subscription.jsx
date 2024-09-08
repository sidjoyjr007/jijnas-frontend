import { useEffect, useState } from "react";
import TextInput from "../../../components/TextInput";
import Button from "../../../components/Button";
import axiosInstance from "../../../utils/axios-config.utils";
import { useSelector } from "react-redux";
import { useNotification } from "../../../context/Notification.context";
import { localToUTC } from "../../../utils/local.utils";
import Table from "../../../components/Table";
const Subscription = () => {
  const user = useSelector((state) => state.user);
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    tokens: { value: "150" }
  });

  const handleBlur = (key) => {
    setFormData({
      ...formData,
      [key]: {
        ...formData?.[key],
        isTouched: true
      }
    });
  };

  const handleFormData = (key, value) => {
    let err = "";
    if (key === "tokens") {
      if (!value) err = "Please enter number of credits to purchase";
      else if (parseInt(value) < 150 || parseInt(value) % 50 !== 0)
        err =
          "You should purchase minimum 150 credits and it should be multiple of 50 (e.g 100, 150, 200)";
    }
    setFormData({
      ...formData,
      [key]: {
        ...formData?.[key],
        value,
        err
      }
    });
  };

  const getBtnDisabledStatus = () => {
    const { tokens } = formData;
    if (!tokens?.value || tokens?.err) {
      return true;
    }
    return false;
  };

  const getPrice = (value) => {
    const { currency, symbol } = user?.moreInfo;
    const rate = user?.rate;
    const tokenPrice = user?.price?.price_per_50_tokens;
    const tokenCount = value / 50;
    if (currency && symbol && rate && tokenPrice) {
      if (currency === "INR")
        return {
          val: Math.ceil(rate * tokenPrice * tokenCount),
          currency: "INR",
          symbol
        };
      return { val: tokenPrice * tokenCount, currency: "USD", symbol: "$" };
    } else {
      return { val: tokenPrice * tokenCount, currency: "USD", symbol: "$" };
    }
  };

  const getPaymentLabel = () => {
    const { value, err } = formData?.tokens;
    if (!value || err) return "Purchase Credits";
    const { val, symbol } = getPrice(value);
    if (symbol === "$" && val < 0.5) {
      setFormData({
        ...formData,
        ["tokens"]: {
          ...formData?.tokens,
          err: "Minimum purchase value should be greter than $0.5"
        }
      });
    }
    return `Pay ${symbol}${val}`;
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    (async () => {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        console.log("Razorpay SDK failed to load. Are you online?");
        return;
      }
    })();
  }, []);

  const columns = [
    {
      id: "activity",
      header: "Activity",
      accessorKey: "activity"
    },
    {
      id: "credits",
      header: "Credits Required",
      accessorKey: "tokens"
    }
  ];

  const handlePayment = async () => {
    try {
      const { val, currency } = getPrice(formData?.tokens?.value);
      const options = {
        amount: val * 100,
        currency: currency
      };
      const res = await axiosInstance.post(
        "/api/v1/payment/create-order",
        options
      );
      const data = res?.data?.order;
      if (data && data?.order_id) {
        const paymentObject = new window.Razorpay({
          key: "rzp_live_PjUfbMmCveGtHY",
          order_id: data.order_id,
          currency: data.currency,
          amount: data.amount,
          name: "QuizNex",
          description: "QuizNex token transaction",
          notes: {
            userId: user?.userId,
            paymentTime: localToUTC(new Date().valueOf())
          },
          ...data,
          handler: async (response) => {
            try {
              const res = await axiosInstance.post(
                "/api/v1/payment/verify-payment",
                {
                  ...response,
                  userId: user?.userId,
                  amount: data?.amount,
                  tokens: parseInt(formData?.tokens?.value),
                  currency: data?.currency,
                  paymentTime: localToUTC(new Date().valueOf())
                }
              );

              if (res.status === 200) {
                showNotification(
                  "Payment completed",
                  res?.data?.message,
                  "success"
                );
                return;
              } else {
                showNotification(
                  "Payment completed",
                  res?.data?.message,
                  "warning"
                );
              }
            } catch (err) {
              showNotification("Error", err.response?.data.message, "alert");
            }
          }
        });
        paymentObject.open();
      } else {
        showNotification(
          "Error",
          "Not able to create order, please try again later",
          "alert"
        );
      }
    } catch (err) {
      showNotification("Error", err.response?.data.message, "alert");
    }
  };

  const tokenPrice = user?.price?.price_per_50_tokens || undefined;
  const {
    AI = "",
    NORMAL = "",
    FILE_100KB = "",
    MIN_FILE_TOKEN = ""
  } = user?.price?.products || {};
  const data = [
    { activity: "Creating quiz manually", tokens: 0 },
    { activity: "Hosting quiz event", tokens: NORMAL },
    { activity: "Generating text based AI quiz", tokens: AI },
    {
      activity: `Document based quiz generator (Note: minimum ${MIN_FILE_TOKEN} credits required if document size is less than 500KiB)`,
      tokens: `${FILE_100KB} credits per 100KiB`
    }
  ];

  return (
    <div className="xl:px-48 2xl:px-72 h-full  px-4 py-6 ">
      <div className=" bg-gray-600/10 rounded-md  px-4 py-4 flex flex-col border border-white/5 gap-y-4">
        {!tokenPrice && (
          <span className="text-gray-400 font-medium text-center">
            Some error occured, please try again later
          </span>
        )}

        {tokenPrice && (
          <>
            <div className="text-gray-400 font-medium text-base">
              You are left with {user?.tokens} credits
            </div>

            <div className="flex flex-col gap-y-4">
              <div>
                <TextInput
                  type="number"
                  label="Get Credits"
                  value={formData?.tokens?.value}
                  onChange={(e) => handleFormData("tokens", e.target.value)}
                  onBlur={() => handleBlur("tokens")}
                  err={
                    (formData?.tokens?.isTouched && formData?.tokens?.err) || ""
                  }
                />
              </div>
              <div>
                <Button
                  label={getPaymentLabel()}
                  handleSubmit={handlePayment}
                  isBtnDisabled={getBtnDisabledStatus()}
                />
              </div>
            </div>
            <div>
              <Table columns={columns} data={data} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Subscription;
