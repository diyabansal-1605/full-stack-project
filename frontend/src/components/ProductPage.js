import React, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './ProductPage.module.css';

const ProductPage = () => {
    const navigate = useNavigate(); 
    const { id } = useParams();
    const [product, setProduct] = useState(null); 
    const [quantity, setQuantity] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false); // State to show/hide review form
    const [review, setReview] = useState(''); // State to store review text
    const [reviews, setReviews] = useState([]); // to store reviews

    // Fetch product and review for that product with id
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`); 
                setProduct(response.data);

                const reviewsResponse = await axios.get(`/api/reviews/${id}`);
                setReviews(reviewsResponse.data)
            } catch (error) {
                console.log('Failed to fetch product:', error);
            }            
        };

        fetchProduct();
    }, [id]);

    // Add to cart functionality
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
                quantity: quantity,
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

    // Handle review submission
    const handleReviewSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please log in to submit a review.");
            navigate('/login');
            return;
        }

        try {
            if(review.length > 0) {
                const response = await axios.post('/api/reviews/add', {
                    productId: id,
                    review: review,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                window.location.reload();
                toast.success("Review submitted successfully!");
                setShowReviewForm(false); 
                setReview('');
                // Updating the reviews list with the new review
                setReviews([...reviews, response.data.review]);
                
            } else {
                toast.error("Please enter your review.")
            }
        } catch (error) {
            toast('You have already submitted a review for this product.', {
                position: "top-center",
                style: {
                    backgroundColor: "#333",
                    color: "#fff",
                },
            });
        }
    };

    return (
        <>
            <div className={styles.productPage}>
                {product ? (
                    <>
                        <div className={styles.productImage}>
                            <img src={`/images/${product.image}`} alt={product.name} />
                        </div>

                        <div className={styles.productDetails}>
                            <h2 className={styles.productName}>{product.name}</h2>
                            <p className={styles.productDescription}>{product.description}</p>
                            <p className={styles.productCapacity}>{product.quantity}</p>
                            <p className={styles.productPrice}>Price: ₹{product.price}</p>
                            <p className={styles.inclusiveLine}>(inclusive of all taxes)</p>
                            <button className={styles.cartBtn} onClick={() => addToCart(product)}>Add to Cart</button>
                            <button className={styles.reviewBtn} onClick={() => setShowReviewForm(!showReviewForm)}>
                                {showReviewForm ? "Cancel" : "Add review"}
                            </button>
                            
                            {/* Review Form */}
                            {showReviewForm && (
                                <div className={styles.reviewForm}>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Write your review here..."
                                    />
                                    <button className={styles.submitBtn} onClick={handleReviewSubmit}>Submit</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Product not found</p>
                )}
            </div>

            {/* Display Reviews */}
            <div className={styles.reviewsSection}>
                <h3>Reviews</h3>
                {reviews.length > 0 ? (
                    reviews.map((rev) => (
                        <div key={rev._id} className={styles.review}>
                            <p>{rev.review}</p>
                            <div className={styles.reviewInfo}>
                                <div className={styles.name}>{rev.user.name}</div>
                                <div className={styles.date}>{new Date(rev.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to review!</p>
                )}
            </div>
        </>
    );
};

export default ProductPage;