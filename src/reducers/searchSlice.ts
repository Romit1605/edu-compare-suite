import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
}

const initialState: SearchState = {
  query: "",
};

export const searchSlice = createSlice({ 
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const { setQuery } = searchSlice.actions;

// Keep the default export as the reducer for convenience in other files
export default searchSlice.reducer;