import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet + React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RiskMapProps {
  lat: number;
  lon: number;
  locationName?: string;
  riskLevel?: string;
}

// Component to handle map center updates
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export const RiskMap = ({ lat, lon, locationName, riskLevel }: RiskMapProps) => {
  const position: [number, number] = [lat, lon];

  return (
    <div className="w-full h-full rounded-[32px] overflow-hidden shadow-inner border border-white relative z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full"
        zoomControl={false}
      >
        <ChangeView center={position} />
        {/* Using a clean, premium-looking tile layer from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="p-1">
              <p className="font-bold text-slate-900 m-0">{locationName || 'Current Location'}</p>
              {riskLevel && (
                <p className={`text-xs font-bold mt-1 mb-0 ${
                  riskLevel === 'HIGH' ? 'text-red-500' : 
                  riskLevel === 'MODERATE' ? 'text-orange-500' : 'text-green-500'
                }`}>
                  Risk Level: {riskLevel}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Overlay for map label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
         <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold text-[#0A5D64] uppercase tracking-widest">Live Map View</span>
         </div>
      </div>
    </div>
  );
};

export default RiskMap;
