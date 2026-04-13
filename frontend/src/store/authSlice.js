import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'simple_app_token';
const USER_KEY = 'simple_app_user';

function loadPersisted() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token: token || null, user };
  } catch {
    return { token: null, user: null };
  }
}

const persisted = loadPersisted();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: persisted.token,
    user: persisted.user,
  },
  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
