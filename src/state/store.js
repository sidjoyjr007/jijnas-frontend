import { configureStore, combineReducers } from "@reduxjs/toolkit";

import quizReducer from "./quiz.slice";
import userReducer from "./user.slice";

const appReducer = combineReducers({
  quiz: quizReducer,
  user: userReducer
});

const rootReducer = (state, action) => {
  if (action.type === "RESET") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer
});
