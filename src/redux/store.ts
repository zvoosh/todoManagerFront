// store.ts
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";

console.log("dusan");
export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
});
