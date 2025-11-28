// store.ts
import { configureStore } from "@reduxjs/toolkit";;
import { searchSlice } from "@/reducers/searchSlice";


export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
  },
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {counter: CounterState, users: UsersState, ...}
export type AppDispatch = typeof store.dispatch;