import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MapWithList from './components/MapWithList';
import ProductList from './components/ProductList';
import 'react-toastify/dist/ReactToastify.css';
import apiEndpoints from './configs/ApiEndpoints'; 

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(apiEndpoints.products);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProductIndex = prevItems.findIndex(item => item.productId === product.productId);
  
      if (existingProductIndex >= 0) {
        const updatedCartItems = [...prevItems];
        updatedCartItems[existingProductIndex] = {
          ...updatedCartItems[existingProductIndex],
          quantityInCart: updatedCartItems[existingProductIndex].quantityInCart + 1
        };
        return updatedCartItems;
      } else {
        return [...prevItems, { ...product, quantityInCart: 1 }];
      }
    });
  };
  
  const handleRemoveFromCart = (product) => {
    setCartItems((prevItems) => {
      const updatedCartItems = prevItems.map(item => {
        if (item.productId === product.productId) {
          return { ...item, quantityInCart: item.quantityInCart - 1 };
        }
        return item;
      }).filter(item => item.quantityInCart > 0);
      return updatedCartItems;
    });
  };

  const removeAllFromCart = (productId) => {
    console.log("Before filtering:", cartItems);
  
    setCartItems((prevItems) => {
      const newCartItems = prevItems.filter(item => item.productId !== productId);
      
      console.log("After filtering:", newCartItems);
      return newCartItems;
    });
  };
  
  

  return (
    <div className="App">
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 to-green-500 to-blue-500 to-indigo-500 to-purple-500 h-1"></div>
      <Header
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onAddToCart={handleAddToCart}
      />
      <main className="flex flex-col md:flex-row">
        <MapWithList
          products={products}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          removeAllFromCart={removeAllFromCart}
        />
      </main>
    </div>
  );
};

export default App;
