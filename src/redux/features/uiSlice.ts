// uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { uiGrid: true, sideMenu: false, mobileSideMenu: false },
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
    toogleMobileSideMenu: (state) => {
      state.mobileSideMenu = !state.mobileSideMenu
    }
  },
});

export const { handleUiGrid, handleUiList, toogleSideMenu, toogleMobileSideMenu } = uiSlice.actions;
export default uiSlice.reducer;
