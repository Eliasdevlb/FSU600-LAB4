import React, { useState } from 'react';
import MapComponent from './MapComponent';

const LocationList = ({ locations }) => {
  const [activeLocationId, setActiveLocationId] = useState(null);

  return (
    <>
      <MapComponent locations={locations} activeLocationId={activeLocationId} />
      <div>
        {locations.map(location => (
          <div
            key={location.id}
            onMouseEnter={() => setActiveLocationId(location.id)}
            onMouseLeave={() => setActiveLocationId(null)}
          >
            {location.name}
          </div>
        ))}
      </div>
    </>
  );
};

export default LocationList;
