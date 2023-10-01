"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BiconomySmartAccount } from "@biconomy/account";
type InitialState = {
  value: SmartAccount;
};

type SmartAccount = {
  smartAccountaddress: string;
  smartAccount: BiconomySmartAccount;
};

const initialState = {
  value: {
    smartAccountaddress: "",
    smartAccount: {} as BiconomySmartAccount,
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
          smartAccount: {} as BiconomySmartAccount,
        },
      };
    },
  },
});
export const { logout, login } = smartAccount.actions;

export default smartAccount.reducer;