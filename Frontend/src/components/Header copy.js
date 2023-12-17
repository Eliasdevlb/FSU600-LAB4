import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { CurrencyContext } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';


const Header = ({ cartItems, onRemoveFromCart, onAddToCart }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [cartVisible, setCartVisible] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const userDropdownRef = useRef(null);
    const cartDropdownRef = useRef(null);
    const navigate = useNavigate();
    const { authData, logout } = useAuth();

    useEffect(() => {
        if (authData && authData.token) {
            //console.log("Token found, " + authData.token)
            setIsLoggedIn(true);
            try {
                const decoded = jwtDecode(authData.token);
                setUserEmail(decoded.email);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
            if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
                setCartVisible(false);
            }
        };

        if (authData && authData.token) {
            const decoded = jwtDecode(authData.token);
            setIsAdmin(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin');
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [authData]);

    const { currency, setCurrency } = useContext(CurrencyContext);

    const handleUserIconClick = () => {
        setShowUserDropdown(!showUserDropdown);
    };

    const handleCartIconClick = () => {
        setCartVisible(!cartVisible);
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleLogout = () => {
        logout();
        setShowUserDropdown(false);
        navigate('/login');
    };

    const handleAdminPanel = () => {
        setShowUserDropdown(false);
        navigate('/admin');
    }

    const handleIncreaseQuantity = (item) => {
        if (item.quantityInCart < item.stockQuantity) {
          const updatedItem = { ...item, quantityInCart: item.quantityInCart + 1 };
          onAddToCart(updatedItem);
        } else {
          toast.warning('Maximum quantity in cart.');
        }
      };
    
    const handleDecreaseQuantity = (item) => {
        if (item.quantityInCart > 1) {
          const updatedItem = { ...item, quantityInCart: item.quantityInCart - 1 };
          onRemoveFromCart(updatedItem);
        } else {
          onRemoveFromCart(item);
          toast.info('Removed item from cart.');
        }
      };



    const handleCheckout = () => {
        navigate('/checkout', { state: { cartItems } });
    };

    return (
        <header className="bg-white py-4 flex justify-between items-center">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-red-600 cursor-pointer" onClick={() => navigate('/')}>blocket</h1>
                <div className="flex items-center">
                    <div>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="relative mr-4" >
                            <option value="SEK">SEK</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                    <div className="relative mr-4" ref={cartDropdownRef}>
                        <button
                            className="flex items-center justify-center relative"
                            onClick={handleCartIconClick}
                            style={{ width: '3rem', height: '3rem' }}
                        >
                            <FontAwesomeIcon
                                icon={faShoppingCart}
                                className={`text-xl cursor-pointer ${cartItems.length > 0 ? 'text-green-600' : 'text-gray-400'}`}
                                onClick={handleCartIconClick}
                            />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>
                        {cartVisible && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl z-20 p-4 mr-4">
                                {cartItems.length === 0 ? (
                                    <div className="text-center text-gray-500">Your cart is empty.</div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <li key={item.productId} className="flex justify-between items-center py-3">
                                                <div className="flex items-center">
                                                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-full mr-2" />
                                                    <div>
                                                        <div className="text-sm font-semibold">{item.name}</div>
                                                        <div className="text-xs text-gray-500">{item.category}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <button onClick={() => handleDecreaseQuantity(item)} className="text-gray-600 hover:text-blue-500 rounded-full p-1">
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </button>
                                                    <span className="mx-2">{item.quantityInCart}</span>
                                                    <button onClick={() => handleIncreaseQuantity(item)} className="text-gray-600 hover:text-blue-500 rounded-full p-1">
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-blue-600"
                                    disabled={cartItems.length === 0}
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative" ref={userDropdownRef} >
                        {userEmail && <span className="mr-2 text-gray-700">{userEmail}</span>}
                        <FontAwesomeIcon icon={faUser} className="text-xl cursor-pointer" onClick={handleUserIconClick} />
                        {showUserDropdown && (
                            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                                {!isLoggedIn ? (
                                    <>
                                        <button onClick={handleLogin} className="w-full text-left block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white">
                                            Login
                                        </button>
                                        <button onClick={handleSignup} className="w-full text-left block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white">
                                            Signup
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {isAdmin && (
                                            <button onClick={handleAdminPanel} className="w-full text-left block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white">
                                                Admin Panel
                                            </button>
                                        )}
                                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white">
                                            Logout
                                        </button>
                                    </>
                                )}

                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer position="top-center" autoClose={2000} />
        </header>
    );
};

export default Header;
