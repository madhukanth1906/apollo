'use client';

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Tag, 
  Info,
  Maximize2,
  FileImage
} from 'lucide-react';
import { PhotoEvidence, PhotoEvidenceCategory, InspectionLocation } from '@/types/inspection';
import { saveInspectionPhotos, loadInspectionPhotos } from '@/services/storageService';
import { CURRENT_INSPECTOR } from '@/services/mockData';

interface PhotoEvidenceSectionProps {
  inspectionId: string;
  initialPhotos?: PhotoEvidence[];
  currentLocation?: InspectionLocation;
  readOnly?: boolean;
  onPhotosChange?: (photos: PhotoEvidence[]) => void;
}

const PHOTO_CATEGORIES: PhotoEvidenceCategory[] = [
  'Establishment Front View',
  'Establishment Name Board',
  'Product Front View (PDP)',
  'Product Back View / Legal Panel',
  'Weighing Instrument',
  'Verification/Stamp Plate',
  'Violation Evidence',
  'Seized Commodity',
  'Other Evidence'
];

export const PhotoEvidenceSection: React.FC<PhotoEvidenceSectionProps> = ({
  inspectionId,
  initialPhotos,
  currentLocation,
  readOnly = false,
  onPhotosChange
}) => {
  const [photos, setPhotos] = useState<PhotoEvidence[]>(() => {
    if (initialPhotos && initialPhotos.length > 0) return initialPhotos;
    const loaded = loadInspectionPhotos(inspectionId);
    if (loaded && loaded.length > 0) return loaded;
    // Default initial demonstration evidence
    return [
      {
        id: 'EVD-001',
        category: 'Product Front View (PDP)',
        fileName: 'front_dual_mrp.jpeg',
        url: '/images/front_dual_mrp.jpeg',
        capturedAt: '20/09/2026 11:28:14',
        latitude: currentLocation?.latitude || 11.341000,
        longitude: currentLocation?.longitude || 77.717200,
        accuracyMeters: currentLocation?.accuracyMeters || 4.8,
        hasGpsMetadata: true,
        officerReferenceId: CURRENT_INSPECTOR.id,
        inspectionReferenceId: inspectionId,
        description: 'Front promotional panel showing ₹250 declaration over retail shelf.'
      },
      {
        id: 'EVD-002',
        category: 'Product Back View / Legal Panel',
        fileName: 'back_dual_mrp.jpeg',
        url: '/images/back_dual_mrp.jpeg',
        capturedAt: '20/09/2026 11:29:02',
        latitude: currentLocation?.latitude || 11.341000,
        longitude: currentLocation?.longitude || 77.717200,
        accuracyMeters: currentLocation?.accuracyMeters || 4.8,
        hasGpsMetadata: true,
        officerReferenceId: CURRENT_INSPECTOR.id,
        inspectionReferenceId: inspectionId,
        description: 'Manufacturer pre-printed legal panel showing ₹200 MRP (Rule 18(2) contradiction).'
      }
    ];
  });

  const [newCategory, setNewCategory] = useState<PhotoEvidenceCategory>('Violation Evidence');
  const [newDescription, setNewDescription] = useState<string>('');
  const [tagWithGPS, setTagWithGPS] = useState<boolean>(true);
  const [selectedPreviewPhoto, setSelectedPreviewPhoto] = useState<PhotoEvidence | null>(null);

  useEffect(() => {
    if (initialPhotos && initialPhotos.length > 0) {
      setPhotos(initialPhotos);
    }
  }, [initialPhotos]);

  const updatePhotos = (newPhotos: PhotoEvidence[]) => {
    setPhotos(newPhotos);
    saveInspectionPhotos(inspectionId, newPhotos);
    if (onPhotosChange) {
      onPhotosChange(newPhotos);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB');
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      const nextId = `EVD-${String(photos.length + 1).padStart(3, '0')}`;

      const newEvidence: PhotoEvidence = {
        id: nextId,
        category: newCategory,
        fileName: file.name,
        url: dataUrl,
        capturedAt: `${dateStr} ${timeStr}`,
        latitude: tagWithGPS && currentLocation ? currentLocation.latitude : undefined,
        longitude: tagWithGPS && currentLocation ? currentLocation.longitude : undefined,
        accuracyMeters: tagWithGPS && currentLocation ? currentLocation.accuracyMeters : undefined,
        hasGpsMetadata: tagWithGPS && !!currentLocation,
        officerReferenceId: CURRENT_INSPECTOR.id,
        inspectionReferenceId: inspectionId,
        description: newDescription || `${newCategory} recorded on-site.`
      };

      updatePhotos([...photos, newEvidence]);
      setNewDescription('');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = (id: string) => {
    const filtered = photos.filter(p => p.id !== id);
    updatePhotos(filtered);
  };

  return (
    <div className="space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-800 pb-2 gap-2">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-slate-800" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            4. Attached Photographic Evidence (Proof of Violation & Geo-Tagging)
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
          {photos.length} Recorded File{photos.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Upload New Evidence Panel */}
      {!readOnly && (
        <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-3">
          <div className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-slate-600" />
            Attach New Photographic Evidence
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Photo Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as PhotoEvidenceCategory)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium focus:outline-none"
              >
                {PHOTO_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Description / Remarks
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Specific observed defect or context"
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Geo-Tag Provenance
              </label>
              <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-[11px] font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={tagWithGPS}
                  onChange={(e) => setTagWithGPS(e.target.checked)}
                  className="rounded border-slate-300 text-[#0a1f44]"
                />
                Tag with current Device GPS fix
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <p className="text-[10px] text-slate-500 italic">
              Strict Provenance Rule: EXIF coordinates are recorded only when explicitly confirmed.
            </p>
            <label className="px-3 py-1.5 bg-[#0a1f44] hover:bg-[#132c5e] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose & Upload Image</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photos.map((item) => (
          <div
            key={item.id}
            className="border border-slate-300 rounded-lg p-3 bg-white flex flex-col justify-between shadow-xs hover:border-slate-400 transition"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div 
                onClick={() => setSelectedPreviewPhoto(item)}
                className="w-28 h-28 flex-shrink-0 bg-slate-100 border border-slate-300 rounded overflow-hidden relative cursor-pointer group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.category}
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Metadata Details */}
              <div className="flex-1 min-w-0 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {item.id}
                  </span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(item.id)}
                      className="text-slate-400 hover:text-red-600 transition p-1"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-xs leading-tight truncate">
                  {item.category}
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description || item.fileName}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{item.capturedAt}</span>
                </div>

                {/* Geo Tag Badge */}
                <div className="pt-0.5">
                  {item.hasGpsMetadata && item.latitude && item.longitude ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                      {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}° (±{item.accuracyMeters ? item.accuracyMeters.toFixed(1) : '5.0'}m)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                      <Info className="w-2.5 h-2.5 text-slate-400" />
                      No embedded GPS (Plain Image Upload)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enlarged Photo Modal */}
      {selectedPreviewPhoto && (
        <div
          onClick={() => setSelectedPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-2xl w-full p-4 space-y-3 border-2 border-slate-300 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h4 className="font-bold text-sm text-slate-900">{selectedPreviewPhoto.category} ({selectedPreviewPhoto.id})</h4>
              <button
                onClick={() => setSelectedPreviewPhoto(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ✕ Close
              </button>
            </div>
            <div className="h-80 w-full bg-slate-100 rounded flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPreviewPhoto.url}
                alt="Enlarged"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <p><strong>Description:</strong> {selectedPreviewPhoto.description}</p>
              <p><strong>Captured:</strong> {selectedPreviewPhoto.capturedAt} by {selectedPreviewPhoto.officerReferenceId}</p>
              {selectedPreviewPhoto.hasGpsMetadata && (
                <p><strong>Coordinates:</strong> {selectedPreviewPhoto.latitude?.toFixed(6)}, {selectedPreviewPhoto.longitude?.toFixed(6)} (±{selectedPreviewPhoto.accuracyMeters?.toFixed(1)}m)</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
