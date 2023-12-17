import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import apiEndpoints from '../configs/ApiEndpoints';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {

  const { authData, logout } = useAuth();

  const initialFormState = {
    Name: '',
    Description: '',
    Price: '',
    Category: '',
    ImageUrl: '',
    StockQuantity: '',
    Location: ''
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [errors, setErrors] = useState({});
  const categories = ['Electronics', 'Books', 'Clothing', 'Food', 'Furniture', 'Cars', 'Other'];
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(initialFormState);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      const response = await fetch(apiEndpoints.products, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!currentProduct.Name) {
      newErrors.Name = 'Product name is required';
      isValid = false;
    }

    if (!currentProduct.Description) {
      newErrors.Description = 'Description is required';
      isValid = false;
    }

    if (!currentProduct.Price) {
      newErrors.Price = 'Price is required';
      isValid = false;
    } else if (isNaN(currentProduct.Price)) {
      newErrors.Price = 'Price must be a number';
      isValid = false;
    }

    if (!currentProduct.ImageUrl) {
      newErrors.ImageUrl = 'Image URL is required';
      isValid = false;
    }

    if (!currentProduct.StockQuantity) {
      newErrors.StockQuantity = 'Stock quantity is required';
      isValid = false;
    } else if (parseInt(currentProduct.StockQuantity, 10) < 0) {
      newErrors.StockQuantity = 'Stock quantity cannot be negative';
      isValid = false;
    }

    if (!currentProduct.Location) {
      newErrors.Location = 'Location is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (authData && authData.token) {
      try {
        const decoded = jwtDecode(authData.token);
        if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] !== 'Admin') {
          navigate('/');
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef, authData, navigate]);



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLoginLogoutClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {

      const productData = {
        ...currentProduct,
        Price: parseFloat(currentProduct.Price),
        StockQuantity: parseInt(currentProduct.StockQuantity, 10)
      };

      const productId = currentProduct.ProductId;
      const method = productId ? 'PUT' : 'POST';
      const url = productId ? `${apiEndpoints.products}/${productId}` : apiEndpoints.products;

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          },
          body: JSON.stringify(productData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchProducts();
        setCurrentProduct(initialFormState);
        setIsAdding(false);
      } catch (error) {
        console.error('There was an error!', error);
      }
    } else {
      toast.error("Please fill in all fields correctly.");
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${apiEndpoints.products}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchProducts();

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error('There was an error deleting the product:', error);

      toast.error("Failed to delete the product.");
    }
  };


  const handleEditClick = (product) => {
    setCurrentProduct({
      ProductId: product.productId,
      Name: product.name,
      Description: product.description,
      Price: product.price,
      Category: product.category,
      ImageUrl: product.imageUrl,
      StockQuantity: product.stockQuantity,
      Location: product.location
    });
    setIsAdding(true);
  }

  const handleAddNewClick = () => {
    setCurrentProduct(initialFormState);
    setIsAdding(true);
  };

  const closeModal = () => {
    setIsAdding(false);
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {}
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 to-green-500 to-blue-500 to-indigo-500 to-purple-500 h-1"></div>
      <header className="bg-white py-4 flex justify-between items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-600">blocket Admin</h1>
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <FontAwesomeIcon icon={faUser} className="text-xl cursor-pointer" onClick={handleLoginLogoutClick} />
              {showDropdown && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                  <>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white">
                      Logout
                    </button>
                  </>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <button
        onClick={handleAddNewClick}
        className="fixed bottom-10 right-10 bg-green-500 text-white p-3 rounded-full shadow-lg text-3xl hover:bg-green-700 focus:outline-none"
        aria-label="Add Product">
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <div className="mt-6 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.productId} className="flex items-center justify-between p-6 mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover mr-6 rounded" />
              <div className="flex-grow p-8">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-sm text-gray-600">Price: {product.price} kr</p>
                <p className="text-sm text-gray-600">Category: {product.category}</p>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <button onClick={() => handleEditClick(product)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2 md:mb-0 md:mr-2 transition-colors duration-300 ease-in-out">
                  Edit
                </button>
                <button onClick={() => handleDelete(product.productId)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-300 ease-in-out">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-6 p-4 text-center">
            <p>No products found. Please add new products to display here.</p>
          </div>
        )}
      </div>
      {}
      {isAdding && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Product Details</h3>
              <div className="mt-2 px-7 py-3">
                <form onSubmit={handleSubmit}>
                  <input type="text" name="Name" placeholder="Product Name" value={currentProduct.Name} onChange={handleInputChange} className="mt-2 px-3 py-2 border rounded-md w-full" />
                  <textarea name="Description" placeholder="Description" value={currentProduct.Description} onChange={handleInputChange} className="mt-2 px-3 py-2 border rounded-md w-full"></textarea>
                  <input type="number" name="Price" placeholder="Price" value={currentProduct.Price} onChange={handleInputChange} className={`mt-2 px-3 py-2 border rounded-md w-full ${errors.Price ? 'border-red-500' : ''}`} />
                  <select name="Category" value={currentProduct.Category} onChange={handleInputChange} className="mt-2 px-3 py-2 border rounded-md w-full">
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                  <input type="text" name="ImageUrl" placeholder="Image URL" value={currentProduct.ImageUrl} onChange={handleInputChange} className="mt-2 px-3 py-2 border rounded-md w-full" />
                  <input type="number" name="StockQuantity" placeholder="Stock Quantity" value={currentProduct.StockQuantity} onChange={handleInputChange} className="mt-2 px-3 py-2 border rounded-md w-full" />
                  <input type="text" name="Location" placeholder="Location" value={currentProduct.Location} onChange={handleInputChange} className="mt-2 px-3 py-2 border rounded-md w-full" />
                  <div className="flex items-center justify-between px-4 py-3 space-x-4">
                    <button type="submit" className="flex-1 bg-blue-500 text-white text-base font-medium rounded-md py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out">
                      {currentProduct.ProductId ? 'Update' : 'Add'}
                    </button>
                    <button type="button" onClick={closeModal} className="flex-1 bg-gray-500 text-white text-base font-medium rounded-md py-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default AdminPage;
