'use client';

import React from 'react';

export const OfficialChecklistForm: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border-2 border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-800 space-y-6 mb-8 page-break-after">
      <div className="text-center pb-4 border-b-2 border-slate-800">
        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase underline mb-2">
          INSPECTION REPORT
        </h1>
        <p className="text-xs font-semibold text-slate-600">
          Under The Legal Metrology Act, 2009 / The Tamil Nadu Legal Metrology (Enforcements) Rules, 2011
        </p>
      </div>

      <div className="space-y-4 text-sm font-medium">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">1. Establishment No.</label>
            <input type="text" className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">2. Licence or Registration No.</label>
            <input type="text" className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 uppercase font-bold mb-1">3. Name and address of the Establishment</label>
          <textarea rows={2} className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1 resize-none" />
        </div>

        <div>
          <label className="block text-xs text-slate-500 uppercase font-bold mb-1">4. Nature of Business</label>
          <input type="text" className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1" />
        </div>

        <div>
          <label className="block text-xs text-slate-500 uppercase font-bold mb-1">5. Name of the Employer (Proprietor, Partner, Directors, etc.) with Designation, Age, S/o. or W/o. details</label>
          <textarea rows={2} className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1 resize-none" />
        </div>

        <div>
          <label className="block text-xs text-slate-500 uppercase font-bold mb-1">6. Name, age and signature of the Employer's representative, who was present at the time of Inspection</label>
          <textarea rows={2} className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1 resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">7. Date of previous inspection</label>
            <input type="date" className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1 text-slate-700" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">8. Date & time of present Inspection</label>
            <input type="datetime-local" className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1 text-slate-700" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">9. Notified weekly holiday</label>
            <input type="text" className="w-full border-b border-slate-300 focus:outline-none focus:border-slate-800 bg-transparent py-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-4">
          {/* Employee Count Section */}
          <div className="space-y-3">
            <label className="block text-xs text-slate-900 uppercase font-bold mb-2 bg-slate-100 p-1.5 rounded">10. Total number of employees</label>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-slate-600 block">Male:</label><input type="number" className="w-full border-b border-slate-300 focus:outline-none bg-transparent" /></div>
              <div><label className="text-xs text-slate-600 block">Female:</label><input type="number" className="w-full border-b border-slate-300 focus:outline-none bg-transparent" /></div>
            </div>
            <div>
              <label className="text-xs text-slate-800 font-semibold block mt-2">Contract/Outsourced (Non Migrants)</label>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 inline">M:</label><input type="number" className="w-16 ml-1 border-b border-slate-300 focus:outline-none bg-transparent" /></div>
                <div><label className="text-xs text-slate-600 inline">F:</label><input type="number" className="w-16 ml-1 border-b border-slate-300 focus:outline-none bg-transparent" /></div>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-800 font-semibold block mt-2">Inter State migrants</label>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 inline">M:</label><input type="number" className="w-16 ml-1 border-b border-slate-300 focus:outline-none bg-transparent" /></div>
                <div><label className="text-xs text-slate-600 inline">F:</label><input type="number" className="w-16 ml-1 border-b border-slate-300 focus:outline-none bg-transparent" /></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs text-slate-900 uppercase font-bold mb-2 bg-slate-100 p-1.5 rounded">12. No. of workers present during inspection</label>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-slate-600 block">Male:</label><input type="number" className="w-full border-b border-slate-300 focus:outline-none bg-transparent" /></div>
              <div><label className="text-xs text-slate-600 block">Female:</label><input type="number" className="w-full border-b border-slate-300 focus:outline-none bg-transparent" /></div>
            </div>
            <div>
              <label className="text-xs text-slate-800 font-semibold block mt-2">Contract/Outsourced (Non Migrants)</label>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 inline">M:</label><input type="number" className="w-16 ml-1 border-b border-slate-300 focus:outline-none bg-transparent" /></div>
                <div><label className="text-xs text-slate-600 inline">F:</label><input type="number" className="w-16 ml-1 border-b border-slate-300 focus:outline-none bg-transparent" /></div>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-800 font-semibold block mt-2">Inter State migrants</label>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 inline">M:</label><input type="number" className="w-16 ml-1 border-b border-slate-300 focus:outline-none bg-transparent" /></div>
                <div><label className="text-xs text-slate-600 inline">F:</label><input type="number" className="w-16 ml-1 border-b border-slate-300 focus:outline-none bg-transparent" /></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <label className="block text-xs text-slate-500 uppercase font-bold mb-1">11. Whether any child labourers are found during inspection?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1"><input type="radio" name="child_labour" value="YES" /> Yes</label>
            <label className="flex items-center gap-1"><input type="radio" name="child_labour" value="NO" defaultChecked /> No</label>
          </div>
        </div>

      </div>
      
      {/* Page Break conceptually here, though it's all one form. The PDF generator will capture it. */}
      
      <div className="pt-6 mt-6 border-t-2 border-slate-800">
        <h2 className="text-sm font-bold uppercase mb-4 text-center">Statutory Checklist</h2>
        <table className="w-full text-xs text-left border-collapse border border-slate-300">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="p-2 border-r border-slate-300 w-10 text-center">S.No</th>
              <th className="p-2 border-r border-slate-300 w-48">Section / Rule</th>
              <th className="p-2 border-r border-slate-300">Details</th>
              <th className="p-2 w-24 text-center">Remarks (Yes/No)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 text-[11px] leading-relaxed">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-2 border-r border-slate-300 text-center font-bold">{idx + 1}</td>
                <td className="p-2 border-r border-slate-300 font-mono text-slate-600">{item.rule}</td>
                <td className="p-2 border-r border-slate-300 font-medium">{item.details}</td>
                <td className="p-2 text-center align-middle">
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name={`chk_${idx}`} value="YES" /> YES</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name={`chk_${idx}`} value="NO" /> NO</label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

const CHECKLIST_ITEMS = [
  { rule: 'Sec 24(1)', details: 'Whether Weights and Measures in the premises is verified and stamped?' },
  { rule: 'Rule 22 of TN L.M. (E) Rules 2011', details: 'Whether the Certified of Verification is exhibited? If so, mention Number & Date of Certificate of Verification?' },
  { rule: 'Rule 27 of L.M. P.C. Rules 2011', details: 'Whether Registration Certificate is obtained under the Legal Metrology (Packaged Commodities) Rules, 2011?' },
  { rule: 'Section 18(1) read with Rule 6(1)', details: 'Whether the Mandatory declaration of P.C. have been made in the packages kept for sale?' },
  { rule: 'Rule 18(2) of L.M. P.C. Rules 2011', details: 'Whether Packaged Commodities are not sold at a price higher than the M.R.P. (Inclusive of all taxes) mentioned in the packets?' },
  { rule: 'Rule 18(7) of L.M. P.C. Rules 2011', details: 'Whether Retailer have Electronic Weighing Machine with Printer for the use of the consumer to provide printed receipt indicating Gross price, Net Quantity, etc.?' },
  { rule: 'Section 23 read with Rule 11 of TN L.M. (E) Rules', details: 'Whether manufacturer or repairer or dealer of weights and measures is License Holder?' },
  { rule: 'Section 23 read with Rule 11', details: 'Whether with getting licence of or renewal of, repairing or sale of weights and measures have been carried out by the Repairer or Dealer?' },
  { rule: 'Section 17 read with Rule 13 of TN L.M. (E) Rules', details: 'Whether records maintained by manufacturer or repairer or dealer?' },
  { rule: 'Section 12', details: 'Whether demanding or receiving any articles or thing on service as per the quantity specified by contract or agreement? If so, mention quantity of Excess or Less?' },
  { rule: 'Rule 21 (4) of L.M. P.C. Rules 2011', details: 'Whether Test weight is available to ensure a proper check of accuracy of a weighing instrument?' },
  { rule: 'Rule 21 (5) of L.M. P.C. Rules 2011', details: 'Whether Test measure is available to ensure a proper check of accuracy of a weighing instrument?' },
  { rule: 'Section 44', details: 'Whether Seal affixed by the authority is original/ genuine/ not counterfeited by any way?' }
];
