import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AllProducts.module.css';
import { Link } from 'react-router-dom';  
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function AllProducts({ searchQuery }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    // Fetch all products when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products'); 
                setProducts(response.data);
                setFilteredProducts(response.data);  
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Whenever the search query changes, update the filtered products
    useEffect(() => {
        if (searchQuery === "") {
            setFilteredProducts(products); // If the search query is empty, show all products
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    // cart functionality
    const addToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please log in to add items to the cart.");
            navigate('/login'); 
            return;
        }
        try {
            const response = await axios.post('/api/cart/add', {
                productId: product._id,
                name: product.name,
                description: product.description,
                image: product.image,
                price: product.price,
                quantity: 1,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.message || "Product added to cart successfully!");
        } catch (error) {
            toast("You can only add up to 10 items for this product.", {
                position: "top-center",
                style: {
                    backgroundColor: "#333",
                    color: "#fff",
                },
            });
        }
    };

    return (
        <div className={styles.products}> 
            {filteredProducts.length === 0 ? (
                <p>No products found.</p>
            ) : (
                filteredProducts.map((product) => (
                    <div key={product._id} className={styles.productItem}>
                        <Link to={`/product/${product._id}`}>
                            <img className={styles.productImage} src={`/images/${product.image}`} alt={product.name} />
                            <h3 className={styles.productName}>{product.name}</h3>
                            <div className={styles.itemFooter}>
                                <p className={styles.productPrice}>₹{product.price.toFixed(2)}</p>
                                <p className={styles.productQuantity}>{product.quantity}</p>
                            </div>
                        </Link>
                        <button className={styles.addToCart} onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                ))
            )}
        </div>
    );
}