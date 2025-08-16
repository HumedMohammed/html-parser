import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { selectIsFetchingUser, selectUser } from "./selector";
import type { AuthState } from "./type";
import { db } from "@/utils/pockatbase";

const initialState: AuthState = {
  user: db.authStore.isValid ? db.authStore.record : null,
  isFetchingUser: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isFetchingUser = false;
    },
    setFetchingUser: (state, action) => {
      state.isFetchingUser = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

export const useAuthSlice = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isFetchingUser = useSelector(selectIsFetchingUser);

  return {
    dispatch,
    actions: authActions,
    user,
    isFetchingUser,
  };
};
