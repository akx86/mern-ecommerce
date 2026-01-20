import { useDispatch, useSelector } from 'react-redux';
import { addToCartAPI, addToCartLocal } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';

export const useAddToCart = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const handleAddToCart = async (product, quantity = 1, showToast = true) => {
        if (!product) return;

        const pId = product._id || product.id;
        
        const rawStock = product.countInStock ?? product.product?.countInStock ?? 0;
        const stockCount = Number(rawStock);

        if (isNaN(stockCount) || stockCount <= 0) {
            toast.error('This product is out of stock');
            return;
        }

        if (isAuthenticated) {
            const existingItem = cartItems.find(item => (item.product._id || item.product) === pId);
            const currentQtyInCart = existingItem ? existingItem.quantity : 0;

            if (currentQtyInCart + quantity > stockCount) {
                toast.error(`Limit reached! You already have ${currentQtyInCart} in cart.`);
                return;
            }

            return dispatch(addToCartAPI({ productId: pId, quantity }))
                .unwrap()
                .then(() => {
                    if (showToast) toast.success('Added to cart ');
                })
                .catch((err) => toast.error(err?.message || 'Failed to add to cart'));
        } 
        else {
            try {
                let localCart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItemIndex = localCart.findIndex(item => item.product === pId);

                if (existingItemIndex >= 0) {
                    if(localCart[existingItemIndex].quantity + quantity > stockCount) {
                        toast.error(`Limit reached! Only ${stockCount} items available.`);
                        return;
                    }
                    localCart[existingItemIndex].quantity += quantity;
                } else {
                    if (quantity > stockCount) {
                        toast.error(`Only ${stockCount} items available`);
                        return;
                    }

                    localCart.push({
                        product: pId,
                        name: product.title || product.name,
                        price: product.price,
                        image: product.image,
                        quantity: quantity,
                        stock: stockCount,
                        countInStock: stockCount 
                    });
                }

                localStorage.setItem('cart', JSON.stringify(localCart));
                dispatch(addToCartLocal(localCart));
                
                if (showToast) toast.success('Added to cart locally');
                
            } catch (error) {
                console.error(error);
                toast.error("Error adding to cart");
            }
        }
    };

    return { handleAddToCart };
};