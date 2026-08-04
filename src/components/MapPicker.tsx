import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapPickerProps {
  mode: 'picker' | 'tracker';
  initialLat?: number;
  initialLng?: number;
  driverLat?: number;
  driverLng?: number;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  height?: string;
}

// Melapalayam, Tirunelveli Default Coords
const DEFAULT_LAT = 8.7075;
const DEFAULT_LNG = 77.7280;

export const MapPicker: React.FC<MapPickerProps> = ({
  mode,
  initialLat = DEFAULT_LAT,
  initialLng = DEFAULT_LNG,
  driverLat = 8.7110,
  driverLng = 77.7310,
  onLocationSelect,
  height = '240px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default icon path issues in leaflet
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 15,
        zoomControl: true,
      });

      // Dark-themed tiles from CartoDB Dark Matter
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      if (mode === 'picker') {
        const customerPin = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
        markerRef.current = customerPin;

        customerPin.on('dragend', () => {
          const latLng = customerPin.getLatLng();
          if (onLocationSelect) {
            onLocationSelect(
              parseFloat(latLng.lat.toFixed(5)),
              parseFloat(latLng.lng.toFixed(5)),
              `Melapalayam Area (${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)})`
            );
          }
        });

        map.on('click', (e) => {
          customerPin.setLatLng(e.latlng);
          if (onLocationSelect) {
            onLocationSelect(
              parseFloat(e.latlng.lat.toFixed(5)),
              parseFloat(e.latlng.lng.toFixed(5)),
              `Melapalayam Area (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`
            );
          }
        });
      } else {
        // Tracker mode: Customer Pin + Driver Pin
        const customerIcon = L.divIcon({
          className: 'custom-customer-icon',
          html: `<div style="background: #FF6B00; border: 2px solid white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 0 15px rgba(255,107,0,0.8)">🏠</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const driverIcon = L.divIcon({
          className: 'custom-driver-icon',
          html: `<div style="background: #22C55E; border: 2px solid white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 0 15px rgba(34,197,94,0.8); animation: pulse 1.5s infinite">🛵</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        L.marker([initialLat, initialLng], { icon: customerIcon }).addTo(map).bindPopup('Delivery Address');
        
        const driverMarker = L.marker([driverLat, driverLng], { icon: driverIcon }).addTo(map).bindPopup('Delivery Boy (On the Way!)');
        driverMarkerRef.current = driverMarker;

        // Draw path polyline
        L.polyline([
          [driverLat, driverLng],
          [initialLat, initialLng]
        ], {
          color: '#FF6B00',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.8
        }).addTo(map);

        const bounds = L.latLngBounds([
          [initialLat, initialLng],
          [driverLat, driverLng]
        ]);
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mode, initialLat, initialLng, driverLat, driverLng]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16);
            markerRef.current.setLatLng([lat, lng]);
            if (onLocationSelect) {
              onLocationSelect(lat, lng, `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            }
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
          alert('Could not auto-fetch location. Tap anywhere on the map to pin your address!');
        }
      );
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 shadow-lg">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

      {mode === 'picker' && (
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="absolute bottom-3 right-3 z-10 bg-secondary/90 hover:bg-primary text-white text-xs font-semibold px-3 py-2 rounded-lg backdrop-blur-md border border-white/10 flex items-center gap-1.5 transition shadow-lg"
        >
          📍 Use Current Location
        </button>
      )}
    </div>
  );
};
