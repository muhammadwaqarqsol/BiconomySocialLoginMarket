"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BiconomySmartAccount } from "@biconomy/account";
import SocialLogin from "@biconomy/web3-auth";
type InitialState = {
  value: SmartAccount;
};

type SmartAccount = {
  sdkref: SocialLogin | null;
};

const initialState: InitialState = {
  value: {
    sdkref: null,
  } as SmartAccount,
};

export const smartAccount = createSlice({
  name: "smartAccount",
  initialState,
  reducers: {
    setSdkRef: (state, action: PayloadAction<SocialLogin | null>) => {
      state.value.sdkref = action.payload;
    },
  },
});

export const { setSdkRef } = smartAccount.actions;

export default smartAccount.reducer;
