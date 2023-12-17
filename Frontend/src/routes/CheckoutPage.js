import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CurrencyContext } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import apiEndpoints from '../configs/ApiEndpoints';

const CheckoutPage = () => {
  const { currency, exchangeRates } = useContext(CurrencyContext);
  const { authData } = useAuth();
  var [cartItems, setCartItems] = useState([]);
  const [email, setEmail] = useState('');

  const loggedInEmail = authData ? getEmailFromToken(authData.token) : null;

  const location = useLocation();
  const navigate = useNavigate();
  cartItems = location.state?.cartItems ?? [];

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const convertPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      console.error('Price is not a valid number:', price);
      return 'Invalid price';
    }

    const rate = exchangeRates[currency];
    if (!rate) {
      console.error('Exchange rate not found for currency:', currency);
      return `${numericPrice} SEK`;
    }

    return (numericPrice * rate).toFixed(2);
  };

  const convertPriceToSEK = (price, currency, exchangeRates) => {
    const rate = exchangeRates[currency];
    if (!rate) {
      console.error('Exchange rate not found for currency:', currency);
      return Math.round(price);
    }

    const priceInSEK = price * rate;
    return Math.round(priceInSEK);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const price = convertPrice(item.price, currency, exchangeRates);
      const totalPriceForItem = parseFloat(price) * item.quantityInCart;
      return total + totalPriceForItem;
    }, 0).toFixed(2) + ` ${currency}`;
  };

  const handleCheckout = async () => {
    const totalInOriginalCurrency = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantityInCart);
    }, 0);

    const totalInSEK = convertPriceToSEK(totalInOriginalCurrency, currency, exchangeRates);

    const orderData = {
      email: authData ? loggedInEmail : email,
      totalPrice: totalInSEK,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantityInCart
      }))
    };

    try {
      const response = await fetch(apiEndpoints.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authData ? { 'Authorization': `Bearer ${authData.token}` } : {})
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast.success('Checkout successful! Redirecting...', {
        position: "top-center",
        autoClose: 2000,
        onClose: () => {
          navigate('/');
          setCartItems([]);
          localStorage.setItem('cartItems', JSON.stringify([]));
        }
      });
    } catch (error) {
      toast.error('Checkout failed. Please try again.', {
        position: "top-center",
        autoClose: 2000,
      });
      console.error('Checkout failed:', error);
    }
  };

  function getEmailFromToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload).sub;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <>
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 to-green-500 to-blue-500 to-indigo-500 to-purple-500 h-1"></div>
      <header className="bg-white py-4 flex justify-between items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-600 cursor-pointer" onClick={navigateHome}>blocket</h1>
        </div>
      </header>
      <div className="container mx-auto p-4 grid grid-cols-2 gap-14">
        <div className="col-span-1">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="mb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 mr-4 rounded-md" />
                    <div>
                      <span>{item.name}</span>
                      <span className="text-gray-500 ml-2">Qty: {item.quantityInCart}</span> {}
                    </div>
                  </div>
                  <span>{convertPrice(item.price) + " "}{currency}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
          {!authData && (
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="border p-2 w-full mb-4"
              required
            />
          )}
          {authData && <p>Billing to: {loggedInEmail}</p>}
          <div className="flex justify-between items-center font-bold mb-4">
            <span>Total:</span>
            <span>{calculateTotal(cartItems)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition-colors"
            disabled={cartItems.length === 0}
          >
            Confirm and Pay
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover style={{ zIndex: 9999 }} />
    </>
  );
};

export default CheckoutPage;
