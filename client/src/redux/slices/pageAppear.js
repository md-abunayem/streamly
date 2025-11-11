import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAddVideoToPlaylistApear: false,
  isEditPlaylistModalAppear: false
};

const pageAppearSlice = createSlice({
  name: "pageAppear",
  initialState,
  reducers: {
    setAddVidoeToPlaylistAppear: (state, action) => {
      state.isAddVideoToPlaylistApear = action.payload;
    },
    setIsEditPlaylistModalAppear: (state, action)=>{
      state.isEditPlaylistModalAppear = action.payload;
    }
  },
});

export default pageAppearSlice.reducer;
export const { 
  setAddVidoeToPlaylistAppear, 
  setIsEditPlaylistModalAppear
} = pageAppearSlice.actions;
