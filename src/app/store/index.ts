// TODO: Setup Redux Toolkit store with slices for auth, farmer, buyer, ai
// Example: configureStore with combined reducers and middleware

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // TODO: Add slice reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
