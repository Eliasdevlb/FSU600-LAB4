import L from 'leaflet';
import redMarker from '../assets/icons/red_marker.png';
import defaultMarker from '../assets/icons/default_marker.png';

const iconClasses = 'w-6 h-10 transition-transform transform hover:scale-110 hover:brightness-110 cursor-pointer';

export const redIcon = new L.Icon({
  iconUrl: redMarker,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: iconClasses,
});

export const defaultIcon = new L.Icon({
  iconUrl: defaultMarker,
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: iconClasses,
});
