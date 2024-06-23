import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  userId: number;
  userName: string;
  token: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userId: 0,
  userName: '',
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ userId: number; userName: string; token: string }>) {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userId = 0;
      state.userName = '';
      state.token = '';
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;