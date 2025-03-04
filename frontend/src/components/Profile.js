import React, { useState, useContext } from 'react';
import styles from './Profile.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
    const { authState, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Track editing state dynamically
    const [isEditing, setIsEditing] = useState({
        name: false,
        email: false,
        phone: false,
    });

    // Store initial values for revert functionality
    const initialState = {
        name: authState.user.name,
        email: authState.user.email,
        phoneNumber: authState.user.phoneNumber,
    };

    // Local state for updated fields
    const [fields, setFields] = useState(initialState);

    // Handle input change
    const handleChange = (e, field) => {
        setFields({ ...fields, [field]: e.target.value });
    };

    // Toggle editing and revert values if canceled
    const handleEditToggle = (field) => {
        if (isEditing[field]) {
            // Cancel editing, revert to initial values
            setFields({ ...fields, [field]: initialState[field] });
        }
        setIsEditing({ ...isEditing, [field]: !isEditing[field] });
    };

    // Update backend with new values
    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:5000/api/auth/update',
                {
                    name: fields.name,
                    email: fields.email,
                    phoneNumber: fields.phoneNumber,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Update authState with the updated user details
            authState.user = { ...authState.user, ...fields };
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    // Handle logout and redirect to login page
    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Successfully logged out!');
    };

    return (
        <>
            <div className={styles.profileContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.profilePart}>
                        <div className={styles.profilePic}>
                            <img src="images/profilePic.svg" alt="profile-pic" />
                        </div>
                        <div className={styles.profileName}>
                            <span className={styles.greeting}>Hello,</span> {authState.user.name}
                        </div>
                    </div>
                    <Link to='/orders'>
                        <div className={styles.leftSideLinks}>My Orders</div>
                    </Link>
                    <div className={styles.leftSideLinks} onClick={handleLogout}>
                        Log out
                    </div>
                </div>

                <div className={styles.rightSide}>
                    <div className={styles.personalInformation}>
                        {/* Name Field */}
                        <div>
                            <div className={styles.nameInfo}>
                                <p className={styles.heading}>Personal Information</p>
                                <p
                                    className={styles.edit}
                                    onClick={() => handleEditToggle('name')}
                                >
                                    {isEditing.name ? 'Cancel' : 'Edit'}
                                </p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={fields.name}
                                    readOnly={!isEditing.name}
                                    onChange={(e) => handleChange(e, 'name')}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <div className={styles.emailInfo}>
                                <p className={styles.heading}>Email Address</p>
                                <p
                                    className={styles.edit}
                                    onClick={() => handleEditToggle('email')}
                                >
                                    {isEditing.email ? 'Cancel' : 'Edit'}
                                </p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={fields.email}
                                    readOnly={!isEditing.email}
                                    onChange={(e) => handleChange(e, 'email')}
                                />
                            </div>
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <div className={styles.mobileInfo}>
                                <p className={styles.heading}>Mobile Number</p>
                                <p
                                    className={styles.edit}
                                    onClick={() => handleEditToggle('phone')}
                                >
                                    {isEditing.phone ? 'Cancel' : 'Edit'}
                                </p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Mobile"
                                    value={fields.phoneNumber}
                                    readOnly={!isEditing.phone}
                                    onChange={(e) => handleChange(e, 'phoneNumber')}
                                />
                            </div>
                        </div>
                    </div>

                    <button onClick={handleSaveChanges} className={styles.saveChangesBtn}>
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}