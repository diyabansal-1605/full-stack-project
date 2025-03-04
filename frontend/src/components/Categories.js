import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Categories.module.css';
export default function Categories() {

  /**
   * State to store the fetched categories data.
   * @state {Array} categories - Holds the list of categories fetched from the backend.
   * @state {Function} setCategories - Updates the `categories` state.
   * Initially, `categories` is an empty array.
  */
  const [categories, setCategories] = useState([]);

  /**
   * useEffect: Fetches categories data from the backend when the component mounts.
   * This hook runs only once due to the empty dependency array `[]`.
  */
  useEffect(() => {
    /**
     * Asynchronous function to fetch categories from the backend API.
     * It uses Axios to send a GET request to the `/api/categories` endpoint.
     * On success: Updates the `categories` state with the fetched data.
     * On failure: Logs the error message to the console.
     */
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      }
      catch (error) {
        console.log(`Erorr in fetching categories : ${error.message}`);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>
      <h2 className={styles.heading}>Shop by category</h2>

      {/* Conditional rendering based on whether categories have been fetched */}
      {categories.length === 0 ? (
        // Display an error image if no categories are found.
        <div><img className={styles.error} src="\images\Error404.jpg" alt="error404"/></div>
      ) : (
        <div className={styles.categoriesContainer}>
          {categories.map((category) => {
            // Construct the image URL and navigation path for each category.
            const imageUrl = `/images/${category.image}`;
            const linkPath = `/${category.name}`;

            return (
              // Individual category card
              <div key={category._id} className={styles.categoriesItem}>
                <Link to={`${linkPath.toLowerCase()}/products`}>
                  <img src={imageUrl} alt={category.name} className={styles.categoryImage} />
                  <h4 className={styles.categoryName}>{category.name}</h4>
                </Link>
              </div>
            );

          })}
        </div>
      )}
    </>
  )
}