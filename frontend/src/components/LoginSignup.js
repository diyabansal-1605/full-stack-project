import React, { useState, useContext } from 'react';
import styles from './LoginSignup.module.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

export default function Login() {

  const { login } = useContext(AuthContext); 
  const [formType, setFormType] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasssword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  // toggle login to sign up form   
  const toggleLoginSignup = () => {
    setFormType((formType == 'login' ? 'sign up' : 'login'));
  }

  // toggle visibility of password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  // Input validation function
  const validateInputs = () => {
    if (formType === 'login') {
      if (!email) {
        toast.error("Please fill in the email address.");
        return false;
      }
      if (!email.includes('@') || !email.includes('.')) {
        toast.error("Please enter a valid email address.");
        return false;
      }
      if (!password) {
        toast.error("Please fill in the password.");
        return false; 
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return false;
      }
    } else {
      if (!name) {
        toast.error("Please fill the name.");
        return false;
      }
      if (!email) {
        toast.error("Please fill the email address.");
        return false;
      }
      if (!email.includes('@') || !email.includes('.')) {
        toast.error("Please enter a valid email.");
        return false;
      }
      if (!password) {
        toast.error("Please fill the password.");
        return false;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return false;
      }
      // if(!phoneNumber) {
      //   toast.error("Please fill the phone number.");
      // }
    }
    return true;
  }

  // handling login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      login(response.data.token); // sending token as parameter to login function in AuthProvider
      toast.success("Login successfull!");
      navigate('/');
    }
    catch (error) {
      toast.error(error.response.data.message || "Invalid email or password.");
    }
  }

  // handling signup submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', { name, email, password, phoneNumber });
      login(response.data.token);
      toast.success("Registered successfully!");
      navigate('/');
    }
    catch (error) {
      toast.error(error.response.data.message || "Please try again.");
    }
  }

  return (
    <>
      <div className={styles.loginSignupForm}>
        {formType === 'login' ? (
          <div className={styles.form}>
            <h2>Login</h2>
            <input
              type="Email"
              placeholder='Enter email address '
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* show or hide password */}
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter password'
                required 
                value={password}
                onChange={(e) => setPasssword(e.target.value)}
              />
              <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <button className={styles.loginButton} onClick={handleLogin}>Log in</button>
            <p className={styles.dontHaveAccountPara}>Don't have an account ? <span className={styles.links} onClick={toggleLoginSignup}> Sign up</span></p>
          </div>

          // Below code is for sign up
        ) : (
          <div className={styles.form}>
            <h2>Create new Account</h2>
            <input
              type="text"
              placeholder='Enter name'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder='Enter email address'
              required value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* show or hide password */}
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter password'
                required value={password}
                onChange={(e) => setPasssword(e.target.value)}
              />
              <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button className={styles.loginButton} onClick={handleSignup}>Sign up</button>
            <p className={styles.dontHaveAccountPara}>Already have an account ? <span className={styles.links} onClick={toggleLoginSignup}>Login</span></p>
          </div>
        )}
      </div>
    </>
  )
}