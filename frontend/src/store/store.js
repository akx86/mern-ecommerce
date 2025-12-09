import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // هنا هنضيف باقي الـ Slices مستقبلاً (زي products, cart)
  },
});