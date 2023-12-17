import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import MapComponent from './MapComponent';


const fetchCoordinates = async (locationName) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.error('Failed to fetch coordinates:', error);
  }
  return null;
};

const MapWithList = ({ products, cartItems, onAddToCart, onRemoveFromCart, removeAllFromCart }) => {
  const [activeProduct, setActiveProduct] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchAllCoordinates = async () => {
      const fetchedLocations = new Set(locations.map(loc => loc.location));
      
      const promises = products
        .filter(product => !fetchedLocations.has(product.location))
        .map(async (product) => {
          const coords = await fetchCoordinates(product.location);
          fetchedLocations.add(product.location);
          return { ...product, ...coords };
        });

      const productsWithCoords = (await Promise.all(promises)).filter(Boolean);
      setLocations(prevLocations => [...prevLocations, ...productsWithCoords]);
    };

    if (products.length > 0) {
      fetchAllCoordinates();
    }
  }, [products]);


 return (
    <div className="flex flex-row w-full">
      <div className="w-2/3">
        <ProductList
          products={products}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          removeAllFromCart={removeAllFromCart}
          onMouseEnter={setActiveProduct}
          onMouseLeave={() => setActiveProduct(null)}
        />
      </div>
      <div className="w-1/3 relative mt-4">
        <div className="sticky top-0">
          {!isFetching && (
            <MapComponent 
              items={locations}
              activeItem={activeProduct}
              onActiveItemChange={setActiveProduct}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapWithList;
