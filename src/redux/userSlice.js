import { createSlice } from '@reduxjs/toolkit';

const savedUserInfo = JSON.parse(localStorage.getItem('userInfo'));

const initialState = {
  user: savedUserInfo?.user || null,
  token: savedUserInfo?.token || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
