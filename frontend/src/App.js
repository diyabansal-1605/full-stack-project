import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Loading from './components/Loading.js';
import ScrollToTop from './components/ScrollToTop.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import LoginSignup from './components/LoginSignup.js';
import Navbar from './components/Navbar.js';
import Profile from './components/Profile.js';
import AllProducts from './components/AllProducts.js';
import Footer from './components/Footer.js';
import Home from './components/Home.js';
import Categories from './components/Categories.js';
import Products from './components/Products.js';
import ProductPage from './components/ProductPage.js';
import Cart from './components/Cart.js';
import Checkout from './components/Checkout.js';
import Orders from './components/Orders.js';

function App() {

  const [loading, setLoading] = useState(false);
  const location = useLocation();

  /* HOW LOADING WORKS ?
  1. using loading state and location
  2. on first render use effect will run , set loading as true and then false after 1 sec
  3. location is used as dependency , now this useEffect will run when location will change
  */
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);

  }, [location]); 

  // Conditionally render Navbar for all routes except '/checkout'
  const showNavbar = location.pathname !== '/checkout';

  // Defining routes where footer should not be displayed
  const notShowFooter =  ['/cart', '/checkout', '/allproducts/search', '/profile', '/orders', '/login'];

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
      setSearchQuery(query);  // Update search query
  };

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <ScrollToTop/>
      {loading && <Loading />}
      {showNavbar && <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />}

      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<LoginSignup/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path="/allproducts/search" element={<AllProducts searchQuery={searchQuery} handleSearch={handleSearch} />}  />
        <Route path='/categories' element={<Categories/>}></Route>
        <Route path='/:categoryName/products' element={<Products/>}></Route>
        <Route path='/:categoryName/products/:subcategoryName' element={<Products/>}></Route>
        <Route path='/product/:id' element={<ProductPage/>}></Route>
        <Route path='/cart' element={<ProtectedRoute> <Cart/> </ProtectedRoute>}></Route>
        <Route path='/checkout' element={<Checkout/>}></Route>
        <Route path='/orders' element={<Orders/>}></Route>
      </Routes>

      {!notShowFooter.includes(location.pathname) && <Footer/>}
    </>
  );
}

export default App;