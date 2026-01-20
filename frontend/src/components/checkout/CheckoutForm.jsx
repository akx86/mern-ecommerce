import { createOrder } from "@/services/orderService";
import { clearCart } from "@/store/slices/cartSlice";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ shippingData, totalAmount, items })=>{
    const stripe = useStripe();
    const elements = useElements();
    const [message , setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/success` },
            redirect: "if_required",
        });

        if (error) {
              console.error("Stripe Error:", error);
                setMessage(error.message);
                toast.error(error.message);
                setIsProcessing(false);
                return;
        }

        if (paymentIntent.status === "succeeded") {
          if (!items || items.length === 0) {
                    toast.error("No items to order!");
                    setIsProcessing(false);
                    return;
                }
            const formattedOrderItems = items.map((item) => {
                
          
                return {
                    name: item?.product.title , 
                    quantity: item.quantity,
                    image: item?.product.image , 
                    price: item?.product.price ,
                    product: item.product._id || item._id, 
                };
            });

            const itemsPrice = formattedOrderItems.reduce((acc, item) => 
                acc + (Number(item.price) * Number(item.quantity)), 0
            );

            const shippingCost = itemsPrice > 500 ? 0 : 50; 
            const taxCost = itemsPrice * 0.10          


            const orderPayload = {
                orderItems: formattedOrderItems,
                shippingAddress: {
                    address: shippingData.address,
                    city: shippingData.city,
                    postalCode: shippingData.postalCode,
                    country: shippingData.country,
                    phone: shippingData.phone || "01000000000",
                },
                paymentMethod: "Card",
                paymentResult: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    update_time: new Date().toISOString(),
                    email_address: paymentIntent.receipt_email || "user@email.com",
                },
                itemsPrice: itemsPrice,
                taxPrice: taxCost,
                shippingPrice: shippingCost,
                totalPrice: totalAmount,
                isPaid: true,
                paidAt: new Date(),
            };
            await createOrder(orderPayload);          
            dispatch(clearCart()); 
            navigate('/success');
        }

    } catch (err) {
        console.error("Server Error Detail:", err.response?.data || err.message);
        setMessage("Server Error: " + (err.response?.data?.message || err.message));
    }

    setIsProcessing(false);
  };
    return (
    <form onSubmit={handleSubmit} className='bg-gray-800 p-6 rounded-lg'>
      <h3 className='text-xl text-white mb-4'>Enter Card Details</h3>

      <PaymentElement id="payment-element" />

      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit"
        className='w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50'
      >
        <span id="button-text">
          {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
        </span>
      </button>

      {message && <div id="payment-message" className='text-red-500 mt-2'>{message}</div>}
    </form>
  );
}
export default CheckoutForm;