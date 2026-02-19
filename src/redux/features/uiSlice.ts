// uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { uiGrid: true, sideMenu: false },
  reducers: {
    handleUiGrid: (state) => {
      state.uiGrid = true;
    },
    handleUiList: (state) => {
      state.uiGrid = false;
    },
    toogleSideMenu: (state) => {
      state.sideMenu = !state.sideMenu;
    },
  },
});

export const { handleUiGrid, handleUiList, toogleSideMenu } = uiSlice.actions;
export default uiSlice.reducer;
