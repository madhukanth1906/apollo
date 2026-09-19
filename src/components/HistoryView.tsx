'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Eye, 
  FileCheck, 
  Download, 
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Printer,
  FileText,
  Building2,
  Scale,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  ListChecks,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RECENT_INSPECTIONS, CURRENT_INSPECTOR } from '@/services/mockData';
import { ComplianceStatus, InspectionRecord } from '@/types/inspection';
import { ComplianceBadge } from './ComplianceBadge';
import { databases } from '@/services/appwrite';
import { Query } from 'appwrite';

interface HistoryViewProps {
  onSelectRecord?: (record: InspectionRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectRecord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeDrawerRecord, setActiveDrawerRecord] = useState<InspectionRecord | null>(null);
  const [liveRecords, setLiveRecords] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await databases.listDocuments('pakshya-db', 'inspections');
        if (response && response.documents && response.documents.length > 0) {
          const parsedRecords = response.documents.map((doc: any) => ({
            id: doc.$id,
            date: doc.date,
            timestamp: doc.timestamp,
            inspectorName: 'Appwrite Inspector',
            inspectorId: doc.inspectorId || 'LMI-001',
            inspectorRegion: 'HQ',
            productName: doc.productName,
            brand: doc.brand,
            sku: doc.sku,
            barcode: 'N/A',
            category: doc.category as any,
            overallStatus: doc.overallStatus as any,
            overallScore: doc.overallScore,
            sampleImages: {},
            declarations: doc.declarations ? JSON.parse(doc.declarations) : [],
            inspectorRemarks: doc.inspectorRemarks,
          }));
          setLiveRecords(parsedRecords);
        }
      } catch (err) {
        console.warn('Appwrite sync unavailable, using central inspection repository data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const allRecords = [...liveRecords, ...RECENT_INSPECTIONS];

  const filtered = allRecords.filter((rec) => {
    const matchesSearch =
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || rec.overallStatus === statusFilter;

    let matchesDate = true;
    if (startDate || endDate) {
      const recDate = new Date(rec.date);
      recDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const [year, month, day] = startDate.split('-');
        const start = new Date(Number(year), Number(month) - 1, Number(day));
        start.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && recDate >= start;
      }
      if (endDate) {
        const [year, month, day] = endDate.split('-');
        const end = new Date(Number(year), Number(month) - 1, Number(day));
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && recDate <= end;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleRowClick = (rec: InspectionRecord) => {
    setActiveDrawerRecord(rec);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-50/70 via-stone-50 to-red-50/40 p-5 rounded-xl border border-red-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <div className="w-64 h-64 bg-red-600 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#a81c1c] text-white shadow-md">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#0B2852] tracking-tight">Central Inspection Log & Digital Repository</h2>
                <span className="text-xs bg-red-50 text-[#8b1515] border border-red-200 px-2 py-0.5 rounded-full font-bold">
                  {allRecords.length} Records Stored
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Audit trail of all field inspections logged under Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-[#8b1515] font-serif italic font-bold text-sm tracking-wide opacity-90">
              Transparent Records Stronger Markets
            </div>
            <button
              onClick={() => alert('Exporting complete inspection repository audit log (CSV/Excel)...')}
              className="px-4 py-2 bg-[#a81c1c] hover:bg-[#8e1717] text-white rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Inspections', value: '248', change: '+ 12%', isUp: true, icon: ListChecks, color: 'text-[#8b1515]', bg: 'bg-red-50' },
          { label: 'Compliant Products', value: '196', change: '+ 20%', isUp: true, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Non-Compliant', value: '52', change: '+ 8%', isUp: true, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Pending Review', value: '38', change: '- 15%', isUp: false, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
            </div>
            <div className={`flex flex-col items-end text-xs font-bold ${stat.isUp ? (i===2 ? 'text-red-600' : 'text-emerald-600') : 'text-amber-600'}`}>
              <div className="flex items-center">
                {stat.isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {stat.change}
              </div>
              <span className="text-[10px] text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search product name, inspection ID (e.g. INSP-2026-08491), brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-200 focus:outline-hidden focus:border-[#a81c1c] focus:ring-1 focus:ring-[#a81c1c] bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium shrink-0 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-500 mr-1">Status:</span>
          {['ALL', 'PASS', 'REVIEW', 'FAIL'].map((st) => {
            let label = st;
            if (st === 'PASS') label = 'Compliant';
            if (st === 'REVIEW') label = 'Requires Review';
            if (st === 'FAIL') label = 'Violation';
            
            let btnClass = 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50';
            if (statusFilter === st) {
              if (st === 'ALL') btnClass = 'bg-[#a81c1c] text-white border-[#a81c1c] font-bold shadow-sm';
              else if (st === 'PASS') btnClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold';
              else if (st === 'REVIEW') btnClass = 'bg-amber-50 text-amber-700 border-amber-300 font-bold';
              else if (st === 'FAIL') btnClass = 'bg-red-50 text-red-700 border-red-300 font-bold';
            } else if (statusFilter !== st && st !== 'ALL') {
              if (st === 'PASS') btnClass += ' border-emerald-200 text-emerald-700';
              if (st === 'REVIEW') btnClass += ' border-amber-200 text-amber-700';
              if (st === 'FAIL') btnClass += ' border-red-200 text-red-700';
            }

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md border transition whitespace-nowrap ${btnClass}`}
              >
                {label}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {/* Consolidated Date Range Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm transition-all focus-within:border-[#a81c1c] focus-within:ring-1 focus-within:ring-[#a81c1c]">
            <div className="flex items-center justify-center px-2.5 py-1.5 bg-slate-50 border-r border-slate-200 text-slate-500" title="Filter by Date Range">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1.5 text-slate-700 text-xs font-semibold focus:outline-none border-none bg-transparent w-32"
            />
            <span className="text-slate-400 text-xs px-1 font-medium bg-slate-50 h-full flex items-center">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1.5 text-slate-700 text-xs font-semibold focus:outline-none border-none bg-transparent w-32"
            />
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="px-2.5 py-1.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition border-l border-slate-200 flex items-center justify-center"
                title="Clear Dates"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: Responsive Split Grid (Table on Left, Contained Drawer on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inspection History Table */}
        <div className={`transition-all duration-300 ${activeDrawerRecord ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Inspection ID</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Product / Commodity</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {isLoading ? (
                    // Skeleton Rows
                    Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="p-3"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                        <td className="p-3">
                          <div className="h-4 bg-slate-200 rounded w-32 mb-1.5"></div>
                          <div className="h-2.5 bg-slate-200 rounded w-16"></div>
                        </td>
                        <td className="p-3">
                          <div className="h-4 bg-slate-200 rounded w-48 mb-1.5"></div>
                          <div className="h-2.5 bg-slate-200 rounded w-20"></div>
                        </td>
                        <td className="p-3"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                        <td className="p-3"><div className="h-4 bg-slate-200 rounded w-10 mx-auto"></div></td>
                        <td className="p-3"><div className="h-5 bg-slate-200 rounded-full w-16 mx-auto"></div></td>
                        <td className="p-3"><div className="h-6 bg-slate-200 rounded w-20 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No inspection records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((rec) => {
                      const isSelected = activeDrawerRecord?.id === rec.id;

                      return (
                        <tr 
                          key={rec.id} 
                          onClick={() => handleRowClick(rec)}
                          className={`transition-colors cursor-pointer border-l-4 ${
                            isSelected 
                              ? 'bg-red-50/70 font-medium border-l-[#a81c1c]' 
                              : `hover:bg-slate-50 ${
                                rec.overallStatus === 'PASS' ? 'border-l-emerald-500' :
                                rec.overallStatus === 'FAIL' ? 'border-l-red-500' : 'border-l-amber-500'
                              }`
                          }`}
                        >
                          <td className="p-4 font-mono font-bold text-slate-800">{rec.id}</td>
                          <td className="p-4 text-slate-800 whitespace-nowrap">
                            <div>{rec.date}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{rec.timestamp}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{rec.productName}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <span className="font-mono">{rec.sku}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>Retail Pack</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-slate-700">
                              <div className="p-1.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                <Building2 className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-medium">{rec.category}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="relative inline-flex items-center justify-center w-10 h-10">
                              <svg className="w-10 h-10 transform -rotate-90">
                                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-100" />
                                <circle 
                                  cx="20" cy="20" r="16" 
                                  stroke="currentColor" 
                                  strokeWidth="3" 
                                  fill="none" 
                                  strokeDasharray="100.5" 
                                  strokeDashoffset={100.5 - (100.5 * rec.overallScore) / 100}
                                  strokeLinecap="round"
                                  className={
                                    rec.overallStatus === 'PASS' ? 'text-emerald-500' :
                                    rec.overallStatus === 'FAIL' ? 'text-red-500' : 'text-amber-500'
                                  } 
                                />
                              </svg>
                              <span className="absolute text-[10px] font-bold text-slate-700">{rec.overallScore}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-white ${
                              rec.overallStatus === 'PASS' ? 'text-emerald-700 border-emerald-200' :
                              rec.overallStatus === 'FAIL' ? 'text-red-700 border-red-200' : 'text-amber-700 border-amber-200'
                            }`}>
                              {rec.overallStatus === 'PASS' && <CheckCircle2 className="w-3 h-3" />}
                              {rec.overallStatus === 'FAIL' && <X className="w-3 h-3" />}
                              {rec.overallStatus === 'REVIEW' && <AlertTriangle className="w-3 h-3" />}
                              {rec.overallStatus === 'PASS' ? 'COMPLIANT' : rec.overallStatus === 'FAIL' ? 'VIOLATION' : 'REQUIRES REVIEW'}
                            </div>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(rec);
                                }}
                                className="px-3 py-1.5 text-[11px] font-semibold text-[#8b1515] bg-red-50 border border-red-200 hover:bg-red-100 rounded-md transition flex items-center gap-1.5 font-bold"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Report</span>
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-white border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center flex-wrap gap-4">
              <span>Showing {filtered.length} inspected commodity records</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select className="border border-slate-200 rounded p-1 text-slate-700 focus:outline-hidden focus:border-[#a81c1c] bg-white">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span>1-10 of 15</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-7 h-7 rounded bg-[#a81c1c] text-white flex items-center justify-center font-bold shadow-xs">1</button>
                    <button className="w-7 h-7 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center font-medium">2</button>
                    <button className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contained Report Side-Panel (Never covers full screen!) */}
        {activeDrawerRecord && (
          <div className="lg:col-span-5 bg-white rounded-lg border-2 border-red-200 shadow-lg overflow-hidden flex flex-col max-h-[800px] animate-in fade-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="bg-[#0B2852] text-white p-4 flex items-center justify-between border-b border-[#081d3d]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Inspection Report Summary
                  </h3>
                  <p className="text-[10px] text-slate-300 font-mono">
                    {activeDrawerRecord.id} • {activeDrawerRecord.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {onSelectRecord && (
                  <button
                    onClick={() => onSelectRecord(activeDrawerRecord)}
                    className="text-[10px] bg-[#a81c1c] hover:bg-[#8e1717] text-white px-2 py-1 rounded font-semibold transition"
                    title="Open Print Dialog"
                  >
                    Print Certificate
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveDrawerRecord(null)}
                  className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition"
                  title="Close side panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
              {/* Product Info & Status */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{activeDrawerRecord.productName}</h4>
                  <ComplianceBadge status={activeDrawerRecord.overallStatus} size="sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>SKU: <strong className="font-mono text-slate-800">{activeDrawerRecord.sku}</strong></div>
                  <div>Category: <strong className="text-slate-800">{activeDrawerRecord.category}</strong></div>
                  <div>Score: <strong className="font-mono text-slate-900">{activeDrawerRecord.overallScore}/100</strong></div>
                  <div>Inspector: <strong className="text-slate-800">{activeDrawerRecord.inspectorName}</strong></div>
                </div>
              </div>

              {/* Declarations List (if any) */}
              {activeDrawerRecord.declarations && activeDrawerRecord.declarations.length > 0 ? (
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    Mandatory Declarations Checked (Rule 6)
                  </h5>
                  <div className="divide-y divide-slate-200 border rounded overflow-hidden">
                    {activeDrawerRecord.declarations.map((d) => (
                      <div key={d.id} className="p-2.5 bg-white flex items-center justify-between gap-2 text-xs">
                        <div>
                          <div className="font-semibold text-slate-900">{d.field}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{d.extractedValue}</div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-500">{d.confidence}%</span>
                          <ComplianceBadge status={d.status} size="sm" showIcon={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700">
                  All standard statutory declarations verified compliant with Legal Metrology (Packaged Commodities) Rules, 2011.
                </div>
              )}

              {/* Inconsistencies or Notes */}
              {activeDrawerRecord.labelTruthFindings && activeDrawerRecord.labelTruthFindings.length > 0 && (
                <div className="p-3 bg-red-50 rounded border border-red-200 space-y-1 text-xs text-red-900">
                  <div className="font-bold uppercase tracking-wide text-[10px] text-red-800">
                    Dual MRP / Packaging Inconsistency
                  </div>
                  <p className="text-[11px] leading-snug">
                    {activeDrawerRecord.labelTruthFindings[0].field}: {activeDrawerRecord.labelTruthFindings[0].viewA.value} vs {activeDrawerRecord.labelTruthFindings[0].viewB.value}
                  </p>
                  <div className="text-[10px] text-slate-600 pt-1">
                    Reference: Rule 18(2) & Section 36(1)
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Inspector Observation
                </span>
                <p className="text-[11px] text-slate-700 italic leading-relaxed">
                  {activeDrawerRecord.overallStatus === 'PASS'
                    ? 'All packaging declarations compliant with Schedule II font height norms and metric standards.'
                    : activeDrawerRecord.overallStatus === 'FAIL'
                    ? 'Statutory non-compliance detected. Show-cause notice recommended under Section 36(1).'
                    : 'Ambiguous declaration region flagged for further laboratory verification.'}
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setActiveDrawerRecord(null)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold cursor-pointer"
              >
                Close Panel
              </button>

              {onSelectRecord && (
                <button
                  type="button"
                  onClick={() => onSelectRecord(activeDrawerRecord)}
                  className="px-4 py-2 bg-[#a81c1c] hover:bg-[#8e1717] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Full Official Form</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
