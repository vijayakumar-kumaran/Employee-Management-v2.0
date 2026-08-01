import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialUser(), // Initial state is loaded from localStorage if present
  reducers: {
    setUser: (state, action) => action.payload, // Set user data
    clearUser: () => null, // Clear user data on logout
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
