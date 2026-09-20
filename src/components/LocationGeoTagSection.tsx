'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Compass,
  Edit3
} from 'lucide-react';
import { InspectionLocation } from '@/types/inspection';
import { saveInspectionLocation, loadInspectionLocation } from '@/services/storageService';
import { useLanguage } from '@/context/LanguageContext';

// Dynamically import map preview to prevent SSR issues with Leaflet
const LocationMapPreview = dynamic(() => import('./LocationMapPreview'), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold rounded-lg border border-slate-200 animate-pulse">
      Loading OpenStreetMap GIS Preview...
    </div>
  )
});

interface LocationGeoTagSectionProps {
  inspectionId?: string;
  initialLocation?: InspectionLocation;
  readOnly?: boolean;
  onLocationChange?: (location: InspectionLocation) => void;
}

export const LocationGeoTagSection: React.FC<LocationGeoTagSectionProps> = ({
  inspectionId = 'INSP-2026-DEFAULT',
  initialLocation,
  readOnly = false,
  onLocationChange
}) => {
  const { t } = useLanguage();
  const [location, setLocation] = useState<InspectionLocation>(() => {
    if (initialLocation) return initialLocation;
    return loadInspectionLocation(inspectionId);
  });

  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [manualEntryMode, setManualEntryMode] = useState<boolean>(location.source === 'Manual');
  const [inputLat, setInputLat] = useState<string>(location.latitude.toFixed(6));
  const [inputLng, setInputLng] = useState<string>(location.longitude.toFixed(6));
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      setInputLat(initialLocation.latitude.toFixed(6));
      setInputLng(initialLocation.longitude.toFixed(6));
    }
  }, [initialLocation]);

  const updateLocationState = (newLoc: InspectionLocation) => {
    setLocation(newLoc);
    saveInspectionLocation(inspectionId, newLoc);
    if (onLocationChange) {
      onLocationChange(newLoc);
    }
  };

  // Browser Geolocation API capture
  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setValidationError('Geolocation is not supported by your browser. Please enter coordinates manually.');
      setManualEntryMode(true);
      return;
    }

    setIsCapturing(true);
    setValidationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const timestamp = new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        const mapsUrl = `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;

        const updated: InspectionLocation = {
          ...location,
          latitude: lat,
          longitude: lng,
          accuracyMeters: accuracy,
          capturedAt: timestamp,
          source: 'GPS',
          googleMapsUrl: mapsUrl
        };

        setInputLat(lat.toFixed(6));
        setInputLng(lng.toFixed(6));
        setManualEntryMode(false);
        setIsCapturing(false);
        updateLocationState(updated);
      },
      (error) => {
        setIsCapturing(false);
        let errorMsg = 'Failed to obtain GPS fix.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'GPS permission denied by user/browser. Please allow location access or input coordinates manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS satellite signal unavailable. Please use manual coordinate entry.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'GPS request timed out. Please try outdoors or enter coordinates manually.';
        }
        setValidationError(errorMsg);
        setManualEntryMode(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  // Auto-request GPS on mount if not readOnly and no GPS fix yet
  useEffect(() => {
    if (!readOnly && location.source !== 'GPS' && navigator.geolocation) {
      // Small timeout to ensure component is fully mounted before prompting
      const timer = setTimeout(() => {
        handleCaptureLocation();
      }, 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);

  // Manual Coordinates submission
  const handleApplyManualCoordinates = () => {
    setValidationError(null);
    const parsedLat = parseFloat(inputLat);
    const parsedLng = parseFloat(inputLng);

    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      setValidationError('Latitude must be a valid number between -90.000000 and +90.000000.');
      return;
    }

    if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      setValidationError('Longitude must be a valid number between -180.000000 and +180.000000.');
      return;
    }

    const timestamp = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const mapsUrl = `https://www.google.com/maps?q=${parsedLat.toFixed(6)},${parsedLng.toFixed(6)}`;

    const updated: InspectionLocation = {
      ...location,
      latitude: parsedLat,
      longitude: parsedLng,
      accuracyMeters: undefined,
      capturedAt: timestamp,
      source: 'Manual',
      googleMapsUrl: mapsUrl
    };

    updateLocationState(updated);
  };

  const handleCopyCoordinates = () => {
    const text = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const isLowAccuracy = (location.accuracyMeters ?? 0) > 50;

  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-5 my-6 text-slate-800 shadow-sm space-y-5">
      {/* Official Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#0a1f44] text-white flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
              {t('geotag_title', 'ESTABLISHMENT LOCATION & GEO-TAG')}
            </h3>
            <p className="text-[11px] text-slate-600 font-medium">
              {t('geotag_sub', 'Statutory verification of on-site establishment premises under Legal Metrology Act, 2009')}
            </p>
          </div>
        </div>

        {/* Verification Status Pill */}
        <div className="flex items-center gap-2">
          {location.source === 'GPS' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified via Device GPS
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold">
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              Manual Coordinate Entry
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-md">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCaptureLocation}
              disabled={isCapturing}
              className="px-3.5 py-1.5 bg-[#0a1f44] hover:bg-[#132c5e] text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCapturing ? 'animate-spin' : ''}`} />
              <span>{isCapturing ? t('capturing', 'Acquiring GPS Fix...') : t('capture_location', 'Capture Current Location')}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCoordinates}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition cursor-pointer"
            >
              {copyFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{t('copied', 'Copied!')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('copy_coords', 'Copy Coordinates')}</span>
                </>
              )}
            </button>

            <a
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('open_gmaps', 'Open in Google Maps')}</span>
            </a>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setManualEntryMode(!manualEntryMode)}
              className="text-xs text-slate-600 hover:text-slate-900 underline font-medium cursor-pointer"
            >
              {manualEntryMode ? 'Hide Manual Inputs' : 'Manual Coordinates Fallback'}
            </button>
          </div>
        </div>
      )}

      {/* Low-Accuracy Warning Banner */}
      {isLowAccuracy && location.source === 'GPS' && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Low GPS Accuracy Notice: </span>
            The captured GPS reading has an accuracy radius of ±{location.accuracyMeters?.toFixed(1)} metres. 
            For high-density municipal areas, outdoor line-of-sight capture is recommended.
          </div>
        </div>
      )}

      {/* Validation or Error Message */}
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>{validationError}</div>
        </div>
      )}

      {/* Manual Coordinates Input Form (When toggled or as fallback) */}
      {manualEntryMode && !readOnly && (
        <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-md space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#0a1f44]" />
            Manual Coordinate Fallback
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Latitude (-90.000000 to +90.000000)
              </label>
              <input
                type="text"
                value={inputLat}
                onChange={(e) => setInputLat(e.target.value)}
                placeholder="e.g. 11.341000"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-[#0a1f44]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Longitude (-180.000000 to +180.000000)
              </label>
              <input
                type="text"
                value={inputLng}
                onChange={(e) => setInputLng(e.target.value)}
                placeholder="e.g. 77.717200"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-[#0a1f44]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleApplyManualCoordinates}
              className="px-3 py-1.5 bg-[#0a1f44] text-white rounded text-xs font-bold hover:bg-[#132c5e] cursor-pointer"
            >
              Apply Manual Coordinates
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Data Card (Left) & Compact Leaflet Map Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Structured Location Card */}
        <div className="lg:col-span-7 border border-slate-300 rounded-lg p-4 bg-slate-50/70 text-xs space-y-3 font-sans">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              ESTABLISHMENT GEO-LOCATION
            </span>
            <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
              Lat: {location.latitude.toFixed(6)}° N • Long: {location.longitude.toFixed(6)}° E
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('gps_accuracy', 'GPS Accuracy')}</span>
              <span className="font-mono font-bold text-slate-800">
                {location.accuracyMeters ? `±${location.accuracyMeters.toFixed(1)} metres` : 'N/A (Manual Entry)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('captured_at', 'Captured Timestamp')}</span>
              <span className="font-mono text-slate-800">{location.capturedAt}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Location Source</span>
              <span className="font-semibold text-slate-800">
                {location.source === 'GPS' ? 'Device GPS / W3C Geolocation' : 'Officer Manual Entry'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('gmaps_link', 'Google Maps Link')}</span>
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-blue-700 hover:underline truncate block"
              >
                maps.google.com/?q={location.latitude.toFixed(4)},{location.longitude.toFixed(4)}
              </a>
            </div>
          </div>

          {/* Structured Address Breakdown */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                {t('shop_address', 'Full Shop Address')}
              </label>
              {readOnly ? (
                <p className="text-slate-900 font-medium">{location.shopAddress || 'Not specified'}</p>
              ) : (
                <input
                  type="text"
                  value={location.shopAddress || ''}
                  onChange={(e) => updateLocationState({ ...location, shopAddress: e.target.value })}
                  placeholder="Premises No, Street, Ward, Bazaar"
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">{t('landmark', 'Landmark')}</label>
                {readOnly ? (
                  <p className="text-slate-900">{location.landmark || '-'}</p>
                ) : (
                  <input
                    type="text"
                    value={location.landmark || ''}
                    onChange={(e) => updateLocationState({ ...location, landmark: e.target.value })}
                    placeholder="Near Junction"
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                  />
                )}
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">{t('district', 'District')}</label>
                {readOnly ? (
                  <p className="text-slate-900">{location.district || '-'}</p>
                ) : (
                  <input
                    type="text"
                    value={location.district || ''}
                    onChange={(e) => updateLocationState({ ...location, district: e.target.value })}
                    placeholder="District"
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                  />
                )}
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">{t('state', 'State')}</label>
                {readOnly ? (
                  <p className="text-slate-900">{location.state || '-'}</p>
                ) : (
                  <input
                    type="text"
                    value={location.state || ''}
                    onChange={(e) => updateLocationState({ ...location, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                  />
                )}
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">{t('pin_code', 'PIN Code')}</label>
                {readOnly ? (
                  <p className="text-slate-900 font-mono">{location.pinCode || '-'}</p>
                ) : (
                  <input
                    type="text"
                    value={location.pinCode || ''}
                    onChange={(e) => updateLocationState({ ...location, pinCode: e.target.value })}
                    placeholder="638001"
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: GIS Leaflet Map Preview */}
        <div className="lg:col-span-5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold uppercase tracking-wider">
            <span>Map Preview (Supporting Evidence)</span>
            <span className="font-mono text-[10px] text-slate-400">OSM / Satellite Datum</span>
          </div>

          <LocationMapPreview
            latitude={location.latitude}
            longitude={location.longitude}
            accuracyMeters={location.accuracyMeters}
            label={location.shopAddress || 'Establishment Premises'}
          />

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
            <span>Accuracy radius: ±{location.accuracyMeters ? location.accuracyMeters.toFixed(1) : 0}m</span>
            <a
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0a1f44] hover:underline font-semibold flex items-center gap-1"
            >
              Open Fullscreen Map <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
