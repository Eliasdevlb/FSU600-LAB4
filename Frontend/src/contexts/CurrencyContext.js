// CurrencyContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext({
  currency: 'SEK', 
  exchangeRates: {}, 
  setCurrency: () => {} 
});

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('SEK');
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/ea6fd159c1fb638bdb0bd796/latest/SEK');
        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`);
        }
        const data = await response.json();
        //console.log('Exchange rates fetched:', data.conversion_rates);
        setExchangeRates(data.conversion_rates);
      } catch (error) {
        console.error("Fetching exchange rates failed", error);
      }
    };
  
    fetchExchangeRates();
  }, []);
  
  
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};
