'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapPreviewProps {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  label?: string;
}

export default function LocationMapPreview({
  latitude,
  longitude,
  accuracyMeters = 5,
  label = 'Inspection Location'
}: LocationMapPreviewProps) {
  if (isNaN(latitude) || isNaN(longitude)) {
    return (
      <div className="h-44 w-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold rounded-lg border border-slate-200">
        Coordinates not available for map preview
      </div>
    );
  }

  const center: [number, number] = [latitude, longitude];

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden border border-slate-300 relative shadow-inner z-0">
      <MapContainer
        key={`${latitude}-${longitude}`}
        center={center}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Accuracy perimeter circle */}
        {accuracyMeters && accuracyMeters > 0 && (
          <Circle
            center={center}
            radius={accuracyMeters}
            pathOptions={{
              color: '#0a1f44',
              fillColor: '#38bdf8',
              fillOpacity: 0.15,
              weight: 1,
              dashArray: '4, 4'
            }}
          />
        )}

        {/* Pin Center Marker */}
        <CircleMarker
          center={center}
          radius={8}
          pathOptions={{
            color: '#ffffff',
            weight: 2,
            fillColor: '#dc2626',
            fillOpacity: 1
          }}
        >
          <Popup>
            <div className="text-xs font-sans">
              <p className="font-bold text-slate-900">{label}</p>
              <p className="font-mono text-[11px] text-slate-600">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
              {accuracyMeters && (
                <p className="text-[10px] text-slate-500">Accuracy: ±{accuracyMeters.toFixed(1)}m</p>
              )}
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
