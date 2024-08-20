import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  verified: false,
  userName: "",
  userEmail: "",
  userId: "",
  userLoading: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signedup: (state, action) => {
      const { data } = action?.payload;
      return {
        ...state,
        isLoggedIn: true,
        ...data,
        isLoading: false
      };
    },
    loggedIn: (state, action) => {
      const {
        data: { name, email, userId, verified }
      } = action?.payload;
      return {
        ...state,
        isLoggedIn: true,
        userName: name,
        userEmail: email,
        userId,
        verified
      };
    },
    updateUserData: (state, action) => {
      const {
        data: { name, email, userId, verified }
      } = action?.payload;
      return {
        ...state,
        isLoggedIn: true,
        userName: name,
        userEmail: email,
        userId,
        verified,
        isLoading: false
      };
    },
    updateVerificationFlag: (state, action) => {
      return {
        ...state,
        verified: true
      };
    },
    setUserLoading: (state, action) => {
      const { isLoading } = action?.payload;
      return {
        ...state,
        isLoading
      };
    },
    userIntialState: () => {
      return {
        ...initialState
      };
    }
  }
});

export const {
  signedup,
  loggedIn,
  updateUserData,
  updateVerificationFlag,
  setUserLoading,
  userIntialState
} = userSlice.actions;

export default userSlice.reducer;
