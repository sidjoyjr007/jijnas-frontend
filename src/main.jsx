import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import { store } from "./state/store.js";
import NotificationProvider from "./context/Notification.context.jsx";
import WrappedRoutes from "./Routes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <NotificationProvider>
      <WrappedRoutes />
    </NotificationProvider>
  </Provider>
);
