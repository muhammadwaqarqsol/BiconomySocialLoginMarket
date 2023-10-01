"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BiconomySmartAccount } from "@biconomy/account";
type InitialState = {
  value: SmartAccount;
};

type SmartAccount = {
  smartAccount: BiconomySmartAccount;
};

const initialState = {
  value: {
    smartAccount: {} as BiconomySmartAccount,
  } as SmartAccount,
} as InitialState;

export const smartAccount = createSlice({
  name: "smartAccount",
  initialState,
  reducers: {
    removeAccount: () => {
      return initialState;
    },
    setAccount: (state, action: PayloadAction<BiconomySmartAccount>) => {
      return {
        value: {
          smartAccount: action.payload,
        },
      };
    },
  },
});

export const { removeAccount, setAccount } = smartAccount.actions;

export default smartAccount.reducer;
