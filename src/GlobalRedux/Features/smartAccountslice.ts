"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: SmartAccount;
};

type SmartAccount = {
  smartAccountaddress: string;
};

const initialState = {
  value: {
    smartAccountaddress: "",
  } as SmartAccount,
} as InitialState;

export const smartAccount = createSlice({
  name: "smartAccount",
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
    login: (state, action: PayloadAction<string>) => {
      return {
        value: {
          smartAccountaddress: action.payload,
        },
      };
    },
  },
});

export const { logout, login } = smartAccount.actions;

export default smartAccount.reducer;
