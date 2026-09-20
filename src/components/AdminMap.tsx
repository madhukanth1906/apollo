'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MarkerData {
  name: string;
  coordinates: [number, number];
  color: string;
  violations: number;
}

interface AdminMapProps {
  markers: MarkerData[];
}

export default function AdminMap({ markers }: AdminMapProps) {
  return (
    <MapContainer 
      center={[22.5937, 78.9629]} // Center of India
      zoom={4} 
      style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: '0.75rem' }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {markers.map((marker, idx) => (
        <CircleMarker 
          key={idx}
          center={marker.coordinates}
          radius={8}
          pathOptions={{
            color: '#fff',
            weight: 1.5,
            fillColor: marker.color,
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div className="font-bold text-xs text-slate-800">{marker.name}</div>
            <div className="text-[10px] text-slate-500">{marker.violations} Violations</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
