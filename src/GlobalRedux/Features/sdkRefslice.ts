"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BiconomySmartAccount } from "@biconomy/account";
import SocialLogin from "@biconomy/web3-auth";
type InitialState = {
  value: SDKRef;
};

type SDKRef = {
  sdkref: SocialLogin | null;
};

const initialState: InitialState = {
  value: {
    sdkref: null,
  } as SDKRef,
};

export const SDK = createSlice({
  name: "sdkRef",
  initialState,
  reducers: {
    setSdkRef: (state, action: PayloadAction<SocialLogin | null>) => {
      state.value.sdkref = action.payload;
    },
  },
});

export const { setSdkRef } = SDK.actions;

export default SDK.reducer;
