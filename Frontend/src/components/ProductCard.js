import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { CurrencyContext } from '../contexts/CurrencyContext';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const convertPrice = (price, currency, exchangeRates) => {
  const rate = exchangeRates[currency];
  if (!rate) {
    console.error('Exchange rate not found for currency:', currency);
    return `${price} ${currency}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price * rate);
};

const ProductCard = ({ product, isInCart, onToggleInCart, onMouseEnter, onMouseLeave }) => {
  const { currency, exchangeRates } = useContext(CurrencyContext);
  const formattedPrice = convertPrice(product.price, currency, exchangeRates);

  if (product.stockQuantity <= 0) {
    return null;
  }

  return (
    <div onMouseEnter={() => onMouseEnter(product)} onMouseLeave={onMouseLeave}>
      <div className="border rounded-lg shadow-md p-8 bg-white hover:shadow-lg transition-transform transform hover:scale-105">
        <div className="flex items-center space-x-4">
          <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-gray-600">{product.description}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">{product.location}</p>
          </div>
        </div>
        <div className="text-right mt-4">
          <p className="text-xl font-bold">{formattedPrice}</p>
          <p className="text-gray-500">Qty: {product.stockQuantity}</p>
        </div>
        <button
          className={`mt-4 p-2 rounded-full ${
            isInCart ? 'bg-green-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-600'
          }`}
          onClick={onToggleInCart}
        >
          <FontAwesomeIcon icon={isInCart ? faCheckCircle : faCartShopping} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
