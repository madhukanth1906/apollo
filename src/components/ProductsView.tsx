'use client';

import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Eye, 
  Fingerprint, 
  FileCheck2, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { ComplianceBadge } from './ComplianceBadge';
import { InspectionRecord } from '@/types/inspection';
import { GenericPackageIcon } from './BrandAssets';

interface ProductsViewProps {
  onNavigateToFingerprint?: () => void;
  onNavigateToInspection?: (record: InspectionRecord) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  onNavigateToFingerprint,
  onNavigateToInspection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<InspectionRecord | null>(null);

  const productsList = Object.values(SAMPLE_PRODUCTS);

  const filtered = productsList.filter((p) => {
    return (
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/40">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">National Packaged Commodity SKU Master Database</h2>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded border border-blue-400 font-mono">
                  Master Registry
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Centralized registry of verified packaged goods, historical packaging baselines, and manufacturer profiles.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded border border-white/20">
            Active Catalog: {productsList.length} Sample Benchmarks
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search commodities by name, brand, SKU or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prod) => (
          <div
            key={prod.sku}
            className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <GenericPackageIcon 
                    variant={prod.overallStatus === 'PASS' ? 'compliant' : prod.overallStatus === 'FAIL' ? 'violation' : 'neutral'}
                    className="w-12 h-13" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{prod.sku}</span>
                  <h3 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {prod.productName}
                  </h3>
                  <div className="text-[11px] text-slate-500">{prod.brand} • {prod.category}</div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Last Inspection:</span>
                <span className="font-mono text-slate-700">{prod.date}</span>
              </div>

              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-500">Statutory Status:</span>
                <ComplianceBadge status={prod.overallStatus} size="sm" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedProduct(prod)}
                className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded text-xs font-semibold border border-blue-200 transition text-center"
              >
                View Profile
              </button>

              <button
                onClick={onNavigateToFingerprint}
                className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded text-xs font-semibold border border-purple-200 transition flex items-center gap-1"
                title="View Historical Packaging Fingerprint"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Fingerprint</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full p-5 border border-slate-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs text-slate-700">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedProduct.productName}</h3>
                <p className="text-[10px] text-slate-500 font-mono">SKU: {selectedProduct.sku} | Barcode: {selectedProduct.barcode}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-slate-50 rounded overflow-hidden border border-slate-200 flex flex-col items-center justify-center p-4">
              <GenericPackageIcon 
                variant={selectedProduct.overallStatus === 'PASS' ? 'compliant' : selectedProduct.overallStatus === 'FAIL' ? 'violation' : 'neutral'}
                className="w-16 h-20"
              />
              <span className="text-[11px] font-mono font-bold text-slate-700 mt-2">
                {selectedProduct.productName}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                Registered Mandatory Packaging Attributes
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border">
                  <span className="text-[10px] text-slate-400 block uppercase">Brand</span>
                  <span className="font-bold text-slate-900">{selectedProduct.brand}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border">
                  <span className="text-[10px] text-slate-400 block uppercase">Category</span>
                  <span className="font-bold text-slate-900">{selectedProduct.category}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border">
                  <span className="text-[10px] text-slate-400 block uppercase">Last Score</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedProduct.overallScore}%</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border">
                  <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                  <ComplianceBadge status={selectedProduct.overallStatus} size="sm" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded font-semibold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onNavigateToInspection?.(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-4 py-1.5 bg-[#0a1f44] text-white rounded font-bold text-xs"
              >
                Launch Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
