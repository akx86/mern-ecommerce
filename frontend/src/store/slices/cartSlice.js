import { addToCart, clearCart as clearCartService, getCart, mergeCart, removeFromCart } from "@/services/cartService";
import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";

export const getCartAPI = createAsyncThunk('cart/getCart',async (_, thunkAPI) => {
    try {
        return await getCart();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const addToCartAPI =createAsyncThunk('cart/addToCart',async (productData, thunkAPI) => {
    try {
        return await addToCart(productData);

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const removeFromCartAPI = createAsyncThunk('cart/remove',async (productId, thunkAPI) => {
    try {
        return await removeFromCart(productId);

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const clearCartAPI = createAsyncThunk('cart/clear',async (_, thunkAPI) => {
    try {
        return await clearCartService();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
})
export const mergeCartAPI = createAsyncThunk('cart/mergeCart',async(localItems, thunkAPI) => {
    try{
        return await mergeCart({ localItems: localItems });
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
})

const calcTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((acc, item) => {
        const price = item.price || 0;
        const qty = item.quantity || 0; 
        return acc + (price * qty);
    }, 0);
};
const initialItems = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
const initialTotal = calcTotal(initialItems);


const cartSlice = createSlice({
    name:'cart',
    initialState:{
        cartItems: initialItems,
        totalPrice: initialTotal,
        loading:false,
        error:null,
        shippingAddress: localStorage.getItem("shippingAddress")
        ? JSON.parse(localStorage.getItem("shippingAddress"))
        : {},
    },
    reducers: {
        saveShippingAddress: (state, action) => {
        state.shippingAddress = action.payload;
        localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalPrice = 0;
            state.error = null;
            state.shippingAddress = {};
            localStorage.removeItem('cart');
            localStorage.removeItem('totalPrice');
            localStorage.removeItem('shippingAddress')
        },
        addToCartLocal: (state, action) => {
            
            state.cartItems = action.payload;
            state.totalPrice = calcTotal(state.cartItems);
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
            localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
        },
        removeFromCartLocal: (state, action) => {
            const productId = action.payload;
            state.cartItems = state.cartItems.filter(item => item.product !== productId);
            state.totalPrice = calcTotal(state.cartItems);
            
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
            localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getCartAPI.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getCartAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.data?.cart?.items || [];
                state.totalPrice = action.payload.data?.cart?.totalPrice || 0;
                localStorage.setItem('cart', JSON.stringify(state.cartItems))
                localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice))
            })
            .addCase(getCartAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(addToCartAPI.pending, (state) => { state.loading = false; state.error = null; })
            .addCase(addToCartAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.data?.cart?.items || [];
                state.totalPrice = action.payload.data?.cart?.totalPrice || 0;
                localStorage.setItem('cart', JSON.stringify(state.cartItems))
                localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice))
            })
            .addCase(addToCartAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }); 
        builder
            .addCase(removeFromCartAPI.pending, (state) => { state.loading = false; state.error = null; })
            .addCase(removeFromCartAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.data?.cart?.items || [];
                state.totalPrice = action.payload.data?.cart?.totalPrice || 0;

            })
            .addCase(removeFromCartAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(clearCartAPI.pending, (state) => { state.loading = false; state.error = null; })
            .addCase(clearCartAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.data?.cart?.items || [];
                state.totalPrice = action.payload.data?.cart?.totalPrice || 0;
                state.shippingAddress = {};
                localStorage.removeItem('cart')
                localStorage.removeItem('totalPrice')
                localStorage.removeItem('shippingAddress')
            })
            .addCase(clearCartAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})
export const { clearCart, addToCartLocal, removeFromCartLocal,saveShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;
