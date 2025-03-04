import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {

    const location = useLocation();

    // Scrolls to the top of the page if the user clicks "Home" while already on the home page.
    const handleHomeClick = () => {
        if (location.pathname === "/") {
            window.scrollTo({
                top: 0,
            });
        }
    };

    return (
    <>
        <div className={styles.footer}>
            
            <div className={styles.footerContainer}>

                <div className={styles.linksContainer}>
                    <h4 className={styles.heading}>Quick Links</h4>
                    <Link onClick={handleHomeClick} className={styles.links} to="/">Home</Link>
                    <Link className={styles.links} to="/cart">Cart</Link>
                    <Link className={styles.links} to="/categories">Categories</Link>
                </div>

                <div className={styles.linksContainer}>
                    <h4 className={styles.heading}>Categories</h4>
                    <Link className={styles.links} to="/beverages/products">Beverages</Link>
                    <Link className={styles.links} to="/snacks/products">Snacks</Link>
                    <Link className={styles.links} to="/bakery/products">Bakery</Link>
                    <Link className={styles.links} to="/stationery/products">Stationery</Link>
                    <Link className={styles.links}  to="/dairy products/products">Dairy Products</Link>
                    <Link className={styles.links} to="/food grains & masalas/products">Food Grains & Masalas</Link>
                    <Link className={styles.links} to="/chocolates & toffees/products">Chocolates & Toffees</Link>
                    <Link className={styles.links} to="/vegetables/products">Vegetables</Link>
                    <Link className={styles.links} to="/toothpaste & brushes/products">Tooth Paste & Brushes</Link>
                </div>

                <div className={styles.linksContainer}>
                    <h4 className={styles.heading}>More Categories</h4>
                    <Link className={styles.links} to="/pooja items/products">Pooja Items</Link>
                    <Link className={styles.links} to="/slippers/products">Slippers</Link>
                    <Link className={styles.links} to="/mosquito repellents/products">Mosquito Repellents</Link>
                    <Link className={styles.links} to="/cleaning & household/products">Cleaning & Household</Link>
                    <Link className={styles.links} to="/skin care/products">Skin Care</Link>
                    <Link className={styles.links} to="/babby care/products">Baby Care</Link>
                    <Link className={styles.links} to="/hair care/products">Hair Care</Link>
                    <Link className={styles.links} to="/led bulbs/products">LED Bulbs</Link>
                    <Link className={styles.links} to="/dry fruits/products">Dry Fruits</Link>
                </div>

                <div className={styles.connectContainer}>
                    <h4 className={styles.heading}>Get in Touch</h4>
                    <Link to="https://github.com/Bhanu-Rana3141?tab=overview&from=2024-08-01&to=2024-08-25">
                        <img style={{height:'35px', position:'relative', top:'3px'}}  className={styles.connect} src="/Images/githubLogo.jpg" alt="GitHub" />
                    </Link>
                    <Link to="https://www.linkedin.com/in/bhanu-partap-singh-rana-875957272/">
                        <img className={styles.connect} src="/Images/linkedinLogo.png" alt="LinkedIn" />
                    </Link>
                </div>
            </div>

            <div className={styles.copyRight}>
                <p>Copyright &copy; 2024, All Rights Reserved.</p>
            </div>

        </div>
    </>
  )
}