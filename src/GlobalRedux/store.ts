"use client";

import { configureStore } from "@reduxjs/toolkit";
import smartAccountReducer from "./Features/smartAccountslice";
import smartReducer from "./Features/smartslice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
export const store = configureStore({
  reducer: {
    smartAccountReducer,
    smartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;