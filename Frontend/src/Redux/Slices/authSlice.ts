import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  userId: number;
  userName: string;
  token: string;
}

// Define initial state for authentication slice
const initialState: AuthState = {
  isLoggedIn: false,
  userId: 0,
  userName: '',
  token: '',
};

// Create authSlice using createSlice from Redux Toolkit
const authSlice = createSlice({
  // Slice name
  name: 'auth',
  // Initial state
  initialState,
  reducers: {
    // Reducer function for handling login action
    login(state, action: PayloadAction<{ userId: number; userName: string; token: string }>) {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.token = action.payload.token;
    },
    // Reducer function for handling logout action
    logout(state) {
      state.isLoggedIn = false;
      state.userId = 0;
      state.userName = '';
      state.token = '';
    },
  },
});

// Export action creators generated by createSlice
export const { login, logout } = authSlice.actions;
// Export the reducer function generated by createSlice
export default authSlice.reducer;