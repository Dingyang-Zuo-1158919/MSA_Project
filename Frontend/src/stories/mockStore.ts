import { configureStore, EnhancedStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer, { RootState } from '../Redux/store';

export const createMockStore = (initialState?: RootState): EnhancedStore => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    devTools: true, // Enable Redux DevTools Extension
    middleware: getDefaultMiddleware({
      serializableCheck: false, // Disable serializableCheck for Storybook
    }),
  });
};