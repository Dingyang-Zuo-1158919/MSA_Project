import { combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';

const store = configureStore({
    reducer: {
      auth: authReducer,
    }
  });

export default store;

const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;