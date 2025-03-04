import React, { useState, useEffect } from 'react';
import styles from './Products.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Products = () => {
    const { categoryName, subcategoryName } = useParams();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Fetch categories to extract subcategories when categoryName changes
    useEffect(() => {
        fetchCategories();
    }, [categoryName]);

    // Fetch products when categoryName or subcategoryName changes
    useEffect(() => {
        fetchProducts();
    }, [categoryName, subcategoryName]);

    /* Fetch all categories to set subcategories
        1. Makes a GET request to fetch the list of categories.
        2. Sets the `categories` state with the response data.
        3. Searches for the category that matches the `categoryName` obtained from the URL.
        4. If the category is found, sets the `subcategories` state with the corresponding subcategories.
        5. If the category is not found, logs an error and sets `subcategories` to an empty array.
        6. If the request fails, logs an error message.
    */
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
            const category = response.data.find(category => category.name.toLowerCase() === categoryName.toLowerCase());
            if (category) {
                setSubcategories(category.subcategories);
            } else {
                console.error('Category not found:', categoryName);
                setSubcategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch products based on category or subcategory
    const fetchProducts = async () => {
        try {
            let response;
            if (subcategoryName) {
                response = await axios.get(`/api/products/category/${categoryName}/subcategory/${subcategoryName}`);
            } else {
                response = await axios.get(`/api/products/category/${categoryName}`);
            }
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    };

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
        <div className={styles.productsContainer}>

            {/* subcategories */}
            <div className={styles.leftSidebar}>
                <ul className={styles.subcategoriesList}>
                    {subcategories.length > 0 ? (
                        subcategories.map((sub) => (
                            <li
                                key={sub}
                                onClick={() => navigate(`/${categoryName}/products/${sub}`)}
                                className={styles.subcategories}
                            >
                                {sub}
                            </li>
                        ))
                    ) : (
                        <p>No subcategories available.</p>
                    )}
                </ul>
            </div>

            {/* products */}
            <div className={styles.products}>
                {products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    products.map((product) => (
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
        </div>
    );
};

export default Products;