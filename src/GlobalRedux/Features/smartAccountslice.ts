"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type InitialState = {
  value: SmartAccountAddress;
};

type SmartAccountAddress = {
  Accountaddress: string;
};

const initialState = {
  value: {
    Accountaddress: "",
  } as SmartAccountAddress,
} as InitialState;

export const smartAccountAddress = createSlice({
  name: "AccountAddress",
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
    login: (state, action: PayloadAction<string>) => {
      return {
        value: {
          Accountaddress: action.payload,
        },
      };
    },
  },
});
export const { logout, login } = smartAccountAddress.actions;

export default smartAccountAddress.reducer;
