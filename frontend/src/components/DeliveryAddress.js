import React, { useState, useEffect } from 'react'
import styles from './DeliveryAddress.module.css'
import { toast } from 'react-toastify';
import axios from 'axios'

export default function DeliveryAddress({ setSavedAddress }) {
    
    const [isFormVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [savedAddress, setAddress] = useState(null); // To store the fetched address - object

    // Fetch saved address when the component loads
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/address/getAddress', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const fetchedAddress = response.data.address;

                if (fetchedAddress) {
                    setAddress(fetchedAddress);
                    setSavedAddress(fetchedAddress); // Updating parent state
                    setFormData(fetchedAddress); // Pre-fill the form with the saved address
                }
            } catch (error) {
                console.error('Error fetching address:', error.response?.data || error.message);
            }
        };
        fetchAddress();
    }, [setSavedAddress]);

    // Toggle visibility of form
    const handleAddAddressClick = () => {
        setFormVisible(!isFormVisible);
    };

    // Update form data as user types
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); 
            let response;
            if (savedAddress) {
                // Update existing address
                response = await axios.put(
                    '/api/address/updateAddress',
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            } else {
                // Add new address
                response = await axios.post(
                    '/api/address/addAddress',
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }
            setFormVisible(false);
            setAddress(response.data.address);
            setSavedAddress(response.data.address); // Update parent state
            window.location.reload();
        } catch (error) {
            console.error('Error saving address:', error.response?.data || error.message);
            toast.error('Failed to save address. Please try again.');
        }
    };

    return (
        <>
            <div className={styles.addressContainer}>
                <div className={`${styles.headingAndButton} ${isFormVisible ? styles.active : ""}`}>
                    <h3 className={styles.heading}>1. DELIVERY ADDRESS</h3>
                    <button className={styles.addBtn} onClick={handleAddAddressClick}>
                        {savedAddress ? (isFormVisible ? 'Cancel' : 'Change Address') : (isFormVisible ? 'Cancel' : 'Add Address')}
                    </button>
                </div>

                {/* Conditional rendering of the form */}
                {isFormVisible && (
                    <form className={styles.addressForm} onSubmit={handleSubmit}>
                        <div>
                            <label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder='Name'
                                    required
                                />
                            </label>
                            <label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder='10-digit mobile number'
                                    required
                                    minLength={10}
                                    maxLength={10}
                                />
                            </label>
                        </div>

                        <div>
                            <label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder='Address (Area and Street)'
                                    required
                                />
                            </label>
                        </div>

                        <div>
                            <label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder='City'
                                    required
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder='State'
                                    required
                                />
                            </label>
                        </div>

                        <div>
                            <label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    placeholder='Pincode'
                                    required
                                    minLength={6}
                                    maxLength={6}
                                />
                            </label>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            Save Address
                        </button>
                    </form>
                )}

                {/* Display the saved address below the form */}
                {savedAddress && !isFormVisible && (
                    <div className={styles.savedAddress}>
                        <p>{savedAddress.name}</p>
                        <p>{savedAddress.address}, {savedAddress.city}</p>
                        <p>{savedAddress.state.toUpperCase()}, {savedAddress.pincode.toUpperCase()}</p> 
                    </div>
                )}
            </div>
        </>
    )
}