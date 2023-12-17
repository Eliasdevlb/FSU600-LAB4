import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import apiEndpoints from '../configs/ApiEndpoints';

const ProductList = ({ cartItems, onAddToCart, onRemoveFromCart, removeAllFromCart, onMouseEnter, onMouseLeave }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(apiEndpoints.products);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);


  const handleToggleInCart = (product) => {
    const isInCart = cartItems.some(item => item.productId === product.productId);
    if (isInCart) {
      removeAllFromCart(product.productId);
    } else {
      onAddToCart(product);
    }
  };

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p>Oh no! It looks like all our products have gone on vacation! 🏖️</p>
        <p>Check back soon, or our products might send you a postcard!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-10">
      {products.map(product => (
        <ProductCard
          key={product.productId}
          product={product}
          isInCart={cartItems.some(item => item.productId === product.productId)}
          onToggleInCart={() => handleToggleInCart(product)}
          onMouseEnter={() => onMouseEnter(product)}
          onMouseLeave={() => onMouseLeave()}
        />
      ))}
    </div>
  );
};

export default ProductList;
