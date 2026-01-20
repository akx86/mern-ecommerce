import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
    try{
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    }catch(e){
        console.warn("User data in local storage is corrupted.",e)
        localStorage.removeItem('user')
        return null;
    }
}
const token = localStorage.getItem('token')
const initialState ={
    user :getUserFromStorage(),
    token :token ||null,
    isAuthenticated :!!token,
}

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.user = action.payload.data.user;
            state.token = action.payload.data.user.token;
            state.isAuthenticated = true;
            localStorage.setItem('user',JSON.stringify(action.payload.data.user));
            localStorage.setItem('token',action.payload.data.user.token);
        },
        logout:(state)=>{
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('cart');

        },
        updateProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    }

})
export const {loginSuccess,logout,updateProfileSuccess} = authSlice.actions;
export default authSlice.reducer;



