import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser as loginAPI, registerUser as registerAPI } from './api/authService';

// جلب المستخدم والتوكن من التخزين المحلي لو موجودين (عشان لو عمل ريفريش)
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- Async Thunks (دوال غير متزامنة للاتصال بالسيرفر) ---

// 1. Login Action
export const login = createAsyncThunk('auth/login', async (userCreds, thunkAPI) => {
  try {
    const response = await loginAPI(userCreds);
    if (response) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.user.token);
    }
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) 
      || error.message 
      || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// register action
export const register = createAsyncThunk('/auth/register',async (user, thunkAPI)=>{
  try {
    const response = await registerAPI(user);

    if(response.token){
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data;
  } catch(error){
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
})

// 2. Logout Action
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // لو عندك API للوج أوت في الباك إند ناديه هنا
});

// --- Slice ---
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => { // لتصفير حالات الخطأ والنجاح
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.user.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // رسالة الخطأ اللي جات من thunkAPI
        state.user = null;
        state.token = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.user.token; 
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;