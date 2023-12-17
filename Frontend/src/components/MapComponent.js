import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { redIcon, defaultIcon } from '../utils/MapIcons';

const MapComponent = ({ items, activeItem, onActiveItemChange }) => {
  const defaultPosition = [57.7089, 11.9746];
  const defaultZoom = 13;

  const safeItems = items.filter(item => item.lat && item.lon);

  return (
    <div className="h-96 w-full lg:w-4/5 xl:w-3/4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <MapContainer center={defaultPosition} zoom={defaultZoom} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {safeItems.map((item) => {
          const isActive = activeItem && activeItem.productId === item.productId;
          const markerClasses = `cursor-pointer transition-transform transform hover:scale-110 ${
            isActive ? 'hover:brightness-110' : 'hover:brightness-100'
          }`;
          return (
            <Marker
              key={item.productId}
              position={[item.lat, item.lon]}
              icon={isActive ? redIcon : defaultIcon}
              eventHandlers={{
                mouseover: () => onActiveItemChange(item),
                mouseout: () => onActiveItemChange(null),
              }}
            >
              <Popup>{item.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
