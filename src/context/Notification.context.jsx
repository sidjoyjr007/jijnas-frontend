import { createContext, useContext, useState } from "react";
import Notification from "../components/Notification.jsx";

export const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

const NotificationProvider = ({ children }) => {
  const [notifcationData, setNotificationdata] = useState({
    msgHeader: "",
    msg: "",
    type: "",
    show: false
  });

  const showNotification = (msgHeader, msg, type) => {
    setNotificationdata({ msgHeader, msg, type, show: true });
  };

  const removeNotification = () =>
    setNotificationdata({ msgHeader: "", msg: "", type: "", show: false });

  return (
    <NotificationContext.Provider
      value={{ showNotification, removeNotification }}
    >
      {notifcationData?.show && <Notification {...notifcationData} />}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
