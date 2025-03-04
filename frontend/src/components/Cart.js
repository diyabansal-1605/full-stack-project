import React from 'react'
import styles from './Cart.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function Cart({ isCheckoutView }) {

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  /* Fetching cart items
   * firsly checking whether user is authorised 
   * if yes , cart items will be fetched , else error 401 unauthorised
  */
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        toast.error("Failed to fetch cart items.");
      }
    };
    fetchCartItems();
  }, []);

  // Changing quantity of products
  const handleQuantityChange = async (productId, quantity) => {
    if (quantity > 10) {
      toast("We only accept orders for a maximum of 10 items.", {
        position: "top-center",
        style: {
          backgroundColor: "#333",
          color: "#fff",
        },
      });
      return;
    }
    try {
      await axios.put(`/api/cart/update`, {
        productId,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCartItems(prevItems => prevItems.map(item => item.productId._id === productId ? { ...item, quantity } : item));
    } catch (error) {
      toast.error("Failed to update cart.");
    }
  }

  // Removing items from cart
  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`/api/cart/remove`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: { productId },
      });
      setCartItems(prevItems => prevItems.filter(item => item.productId._id !== productId));
      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error("Failed to remove item from cart.");
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleClick = () => {
    navigate('/checkout');
  }

  const handlePayment = async () => {
    try {
      // Step 1: Create an order on the backend
      const totalAmount = calculateTotalPrice();
      const response = await axios.post('/api/payment/order', { amount: totalAmount }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const {id: orderId, amount, currency } = response.data;

      // Step 2: Initialize Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'BPS Dukaan',
        description: 'Thank you for shopping with us.',
        order_id: orderId,
        theme: {
          color: '#3399cc',
        },
        handler: async function (response) {
          // Step 3: Handle payment success
         
          const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };
          
          try {
            // Verify the payment on the backend
            const verifyResponse = await axios.post('/api/payment/verify', paymentData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

            if (verifyResponse.data.success) {
              toast("Order placed successfully! Thank you for shopping with us.", {
                position: "top-center",
                style: {
                    backgroundColor: "#333",
                    color: "#fff",
                },
              });
              navigate('/');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (error) {
            console.error('Error during payment verification:', error);
            toast.error('Unable to verify payment. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            toast.warning('Payment process was cancelled.');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Error during payment:', error);
      toast.error('Unable to initiate payment. Please try again later.');
    }
  };

  return (
    <>
      <div className={`${styles.cartContainer} ${isCheckoutView ? styles.checkoutCart : ''}`}>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <img src='images\cartEmpty.png' alt='Cart empty'></img>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <ul className={styles.cartList}>
              {!isCheckoutView && <h2 className={styles.cartHeading}>Shopping Cart</h2>}
              {cartItems.map(item => (
                <>
                  <hr></hr>
                  <li key={item.productId._id} className={styles.cartItem}>
                    <img src={`/images/${item.productId.image}`} alt={item.productId.name} />
                    <div className={styles.itemDetails}>
                      <p className={styles.productName}>{item.productId.name}</p>
                      <p className={styles.productDescription}>{item.productId.description}</p>
                      <p className={styles.productPrice}>Price: ₹{item.productId.price}</p>
                      <p>
                        <select
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId._id, Number(e.target.value))}
                        >
                          <option value="1">Qty: 1</option>
                          <option value="2">Qty: 2</option>
                          <option value="3">Qty: 3</option>
                          <option value="4">Qty: 4</option>
                          <option value="5">Qty: 5</option>
                          <option value="6">Qty: 6</option>
                          <option value="7">Qty: 7</option>
                          <option value="8">Qty: 8</option>
                          <option value="9">Qty: 9</option>
                          <option value="10">Qty: 10</option>
                        </select>
                        <span className={styles.deleteLink} onClick={() => handleRemoveItem(item.productId._id)}>Delete</span>
                      </p>
                    </div>
                  </li>
                </>
              ))}

              <hr></hr>
              {!isCheckoutView && <p className={styles.subtotal}>Subtotal ( {cartItems.length} {cartItems.length > 1 ? 'items' : 'item'}) : ₹{calculateTotalPrice()}</p>
              }
            </ul>

            {/* price details part */}
            <div className={`${styles.priceDetails} ${isCheckoutView ? styles.checkoutPriceDetails : ''}`}>
              <div className={styles.priceDetailsHeading}>Price Details</div>

              <div className={styles.itemsPrice}>
                <div>Price ({cartItems.length} {cartItems.length > 1 ? 'items' : 'item'})</div>
                <div>₹{calculateTotalPrice()}</div>
              </div>

              <div className={styles.deliveryCharge}>
                <div>Delivery Charges</div>
                <div><del className={styles.deleteDeliveryCharges}>₹50</del>FREE</div>
              </div>

              <div className={styles.total}>
                <div>Subtotal</div>
                <div>₹{calculateTotalPrice()}</div>
              </div>

              <div className={styles.proceedToBuyBtn}>
                {isCheckoutView ? (
                  <button onClick={handlePayment} className={styles.proceedButton}>Pay Now</button>
                ) : (
                  <button onClick={handleClick} className={styles.proceedButton}>Proceed to Buy</button>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </>
  )
}