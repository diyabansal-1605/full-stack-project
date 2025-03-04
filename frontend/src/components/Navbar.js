import React from 'react'
import styles from './Navbar.module.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'; 
import { FaUserCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faMagnifyingGlass , faXmark} from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ searchQuery, handleSearch }) {

    // Destructuring authState(contains token and user) and logout function from AuthContext
    const { authState, logout } = useContext(AuthContext); 
    const [isMobileMenuOpen, setMobileMenu] = useState(false); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setMobileMenu(!isMobileMenuOpen);
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    /*  CLOSE THE DROPDOWN MENU
        * useEffect hook has a function handleClickOutside used for closing the dropdown, when a user clicks anywhere outside of the dropdown menu.
        *  event is passed as parameter 
        * dropdownRef is a reference created using useRef and dropdownRef.current specifies the dropdown element(user menu)
        * firstly it is checked whether dropdownRef.current exists(!null) and then element(event.target) is present in dropdownRef.current element
        * if no close dropdown
        * document represent entire web page, and if user clicks outside of dropdownRef.current dropdown will be closed 
    */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Handle logout and redirect to login page
    const handleLogout = () => {
        logout(); 
        setDropdownOpen(false); 
        navigate('/login'); 
        toast.success('Successfully logged out!');
    };
      
    // Navigate to the All Products page to search products
    const handleSearchClick = () => {
        navigate('/allproducts/search');  
    };

    return (
    <>
        <div className={styles.navbar}>
            {/* logo */}
            <div className={styles.logoParent}>
                <Link to="/"><img className={styles.logo} src="\images\logo.png" alt="logo" /></Link>
            </div>

            {/* search bar */}
            <div className={styles.searchParent}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                <input className={styles.searchBar} type="text" placeholder='Search Products' onClick={handleSearchClick} onChange={(e) => handleSearch(e.target.value)} /> 
            </div>

            {/* navlinks */}
            <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ""}`}>
                <Link to="/">Home</Link>
                <div className={styles.cart}>
                    <Link to="/cart" className={styles.cartText}>Cart</Link>
                    <Link to="/cart"><img className={styles.cartIcon} src="\images\cart.png" alt="cart" /></Link>
                </div>

                {/* Conditional Rendering Based on Auth State for login button or profile icon */}
                {authState.user ? (
                    <div className={styles.userMenu} ref={dropdownRef}>
                        <button className={styles.userProfile} onClick={toggleDropdown}>
                            <FaUserCircle className={styles.userIcon} size={38} />
                        </button>
                        {dropdownOpen && (
                            <div className={styles.dropdown}>
                                <p className={styles.welcomeText}>Hello, {authState.user.name}!</p>
                                <Link to="/profile" className={styles.dropdownLink}>My Profile</Link>
                                <button className={styles.logoutButton} onClick={handleLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login"><button className={styles.loginButton}>Login</button></Link>
                )}
            </div>
            
            {/* Hamburger icon */}
            <div className={styles.hamburgerIcon} onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                    <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} />
                ) : (
                    <>
                        <div className={styles.line}></div>
                        <div className={styles.line}></div>
                        <div className={styles.line}></div>
                    </>
                )}
            </div>
        </div>
    </>
  )
}
