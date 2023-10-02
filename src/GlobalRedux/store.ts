"use client";

import { configureStore } from "@reduxjs/toolkit";
import smartAccountReducer from "./Features/smartAccountslice";
import smartReducer from "./Features/smartslice";
import sdkRefReducer from "./Features/sdkRefslice";

import { TypedUseSelectorHook, useSelector } from "react-redux";
export const store = configureStore({
  reducer: {
    smartAccountReducer,
    smartReducer,
    sdkRefReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
