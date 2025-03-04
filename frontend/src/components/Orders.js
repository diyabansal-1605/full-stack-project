import React, { useEffect, useState } from 'react';
import styles from './Orders.module.css'
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    // fetching orders 
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    }
                });
                setOrders(response.data.orders);
            } catch (err) {
                console.error('Error fetching orders:', err);
            };
        }
        fetchOrders();
    }, []);

    return (
        <div className={styles.container}>
            {orders.length === 0 ? (
                <p>No orders placed yet.</p>
            ) : (
                <div>
                    <h2 className={styles.heading}>Your Orders</h2>
                    {orders.map((order) => (
                        <div className={styles.orderContainer} key={order._id}>
                            {order.products.map((product) => (
                                <div className={styles.order}>
                                    <div className={styles.imageAndName}>
                                        <img src={`/images/${product.productId.image}`} alt={product.name} />
                                        <p className={styles.productName}>{product.name}</p>
                                    </div>
                                    <p>{product.productId.quantity}</p>
                                    <p>₹{product.price}</p>
                                    <p>quantity: {product.quantity}</p>
                                    <p className={styles.calculatedPrice}>₹{product.price * product.quantity}</p>
                                </div>
                            ))}
                            
                            <p className={styles.totalAmount}>Total Amount: ₹{order.totalAmount}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
