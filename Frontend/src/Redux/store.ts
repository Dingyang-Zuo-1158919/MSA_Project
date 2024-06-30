import { combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';

// Configure the Redux store with authReducer as the only reducer
const store = configureStore({
    reducer: {
      auth: authReducer,
    }
  });

// Export the configured store as default
export default store;

// Combine reducers for potential future expansion
const rootReducer = combineReducers({
  // Include authReducer for authentication state management
  auth: authReducer,
});

// Define RootState type for type-safe useSelector hooks
export type RootState = ReturnType<typeof rootReducer>;