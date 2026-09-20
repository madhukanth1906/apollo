'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Sliders, 
  Bell, 
  Monitor, 
  ShieldCheck, 
  Lock, 
  Edit3, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Globe, 
  Calendar, 
  Clock, 
  LayoutGrid, 
  List, 
  Sun, 
  Moon, 
  FileText, 
  Key, 
  Laptop, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [theme, setTheme] = useState<'Light' | 'Dark' | 'System'>('Light');
  const [fontSize, setFontSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [highContrast, setHighContrast] = useState(false);
  const [notifications, setNotifications] = useState({
    inspection: true,
    violation: true,
    system: true,
    policy: true,
    email: false
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-50/70 via-stone-50 to-red-50/40 border border-red-200/80 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-gradient-to-br from-[#a81c1c] to-[#881313] w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shadow-red-900/20">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-slate-900 font-bold text-2xl">{t('settings_title', 'Settings')}</h2>
            <p className="text-slate-600 text-sm mt-0.5">
              {t('settings_sub', 'Manage your account, preferences, notifications and application settings.')}
            </p>
          </div>
        </div>

        <div className="relative z-10 text-right flex flex-col items-end">
          <div className="text-[#8b1515] font-serif italic font-bold tracking-wide">
            "Transparent Governance"
          </div>
          <div className="text-[#8b1515] font-serif italic font-bold tracking-wide">
            "Stronger Consumer Protection"
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mt-2 rounded-full border border-slate-200"></div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Profile & Account */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base">{t('profile_account', 'Profile & Account')}</h3>
              <p className="text-slate-500 text-xs">Manage your personal information and account details.</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white font-bold text-xl w-14 h-14 rounded-full flex items-center justify-center">
                RV
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-base">Rajesh Varma</h4>
                <p className="text-slate-500 text-xs">Legal Metrology Officer</p>
                <p className="text-slate-400 text-xs">GOI-LMO-DL-0482</p>
              </div>
            </div>
            <button className="border border-[#a81c1c] text-[#8b1515] bg-white hover:bg-red-50 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
              <Edit3 className="w-3.5 h-3.5" /> {t('edit_profile', 'Edit Profile')}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" /> {t('email', 'Email')}
              </div>
              <span className="font-medium text-slate-900">rajesh.varma@nic.in</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" /> {t('phone', 'Phone')}
              </div>
              <span className="font-medium text-slate-900">+91 98765 43210</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Building2 className="w-4 h-4 text-slate-400" /> {t('department', 'Department')}
              </div>
              <span className="font-medium text-slate-900">Legal Metrology Division</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400" /> {t('jurisdiction', 'Jurisdiction')}
              </div>
              <span className="font-medium text-slate-900">Delhi (NCT)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> {t('role', 'Role')}
              </div>
              <span className="font-medium text-slate-900">Full Inspection Authority</span>
            </div>
          </div>
        </div>

        {/* Card 2: Application Preferences */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base">{t('app_preferences', 'Application Preferences')}</h3>
              <p className="text-slate-500 text-xs">Customize the application to your workflow.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">{t('language_select', 'Language')}</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm font-semibold text-slate-800 bg-white shadow-xs focus:border-[#a81c1c] focus:outline-hidden appearance-none cursor-pointer"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">{t('date_format', 'Date Format')}</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 bg-white shadow-xs focus:border-[#a81c1c] focus:outline-hidden appearance-none">
                  <option>DD/MM/YYYY</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Time Format</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 bg-white shadow-xs focus:border-[#a81c1c] focus:outline-hidden appearance-none">
                  <option>12 Hour (AM/PM)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Default View</label>
              <div className="relative">
                <LayoutGrid className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 bg-white shadow-xs focus:border-[#a81c1c] focus:outline-hidden appearance-none">
                  <option>Dashboard</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Items per Page</label>
              <div className="relative">
                <List className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 bg-white shadow-xs focus:border-[#a81c1c] focus:outline-hidden appearance-none">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base">Notifications</h3>
              <p className="text-slate-500 text-xs">Manage your notification preferences.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'inspection', icon: FileText, title: 'Inspection Alerts', desc: 'Get notified about new inspection assignments', color: 'emerald' },
              { id: 'violation', icon: ShieldCheck, title: 'Violation Alerts', desc: 'Receive alerts for high-risk violations', color: 'red' },
              { id: 'system', icon: Settings, title: 'System Updates', desc: 'Product updates and new features', color: 'red' },
              { id: 'policy', icon: FileText, title: 'Policy & Circulars', desc: 'New guidelines and government notifications', color: 'amber' },
              { id: 'email', icon: Mail, title: 'Email Notifications', desc: 'Receive important updates via email', color: 'slate' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${item.color}-50 text-${item.color}-600`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <div 
                  className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${notifications[item.id as keyof typeof notifications] ? 'bg-[#a81c1c]' : 'bg-gray-300'}`}
                  onClick={() => setNotifications(prev => ({...prev, [item.id]: !prev[item.id as keyof typeof notifications]}))}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications[item.id as keyof typeof notifications] ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Display & Accessibility */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base">Display & Accessibility</h3>
              <p className="text-slate-500 text-xs">Adjust the appearance and accessibility settings.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 block">Theme</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTheme('Light')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${theme === 'Light' ? 'bg-red-50 text-[#8b1515] border-2 border-[#a81c1c] shadow-xs' : 'border border-gray-200 text-slate-700 hover:bg-gray-50'}`}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <button 
                  onClick={() => setTheme('Dark')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${theme === 'Dark' ? 'bg-red-50 text-[#8b1515] border-2 border-[#a81c1c] shadow-xs' : 'border border-gray-200 text-slate-700 hover:bg-gray-50'}`}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
                <button 
                  onClick={() => setTheme('System')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${theme === 'System' ? 'bg-red-50 text-[#8b1515] border-2 border-[#a81c1c] shadow-xs' : 'border border-gray-200 text-slate-700 hover:bg-gray-50'}`}
                >
                  <Monitor className="w-4 h-4" /> System
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 block">Font Size</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFontSize('Small')}
                  className={`flex-1 px-4 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${fontSize === 'Small' ? 'bg-red-50 text-[#8b1515] border-2 border-[#a81c1c] shadow-xs font-semibold' : 'border border-gray-200 text-slate-700 hover:bg-gray-50'}`}
                >
                  A Small
                </button>
                <button 
                  onClick={() => setFontSize('Medium')}
                  className={`flex-1 px-4 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${fontSize === 'Medium' ? 'bg-red-50 text-[#8b1515] border-2 border-[#a81c1c] shadow-xs font-semibold' : 'border border-gray-200 text-slate-700 hover:bg-gray-50'}`}
                >
                  A Medium
                </button>
                <button 
                  onClick={() => setFontSize('Large')}
                  className={`flex-1 px-4 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${fontSize === 'Large' ? 'bg-red-50 text-[#8b1515] border-2 border-[#a81c1c] shadow-xs font-semibold' : 'border border-gray-200 text-slate-700 hover:bg-gray-50'}`}
                >
                  A Large
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block">High Contrast</label>
                  <p className="text-xs text-slate-500">Improve visibility for better accessibility</p>
                </div>
                <div 
                  className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${highContrast ? 'bg-[#a81c1c]' : 'bg-gray-300'}`}
                  onClick={() => setHighContrast(!highContrast)}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${highContrast ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Data & Privacy */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base">Data & Privacy</h3>
              <p className="text-slate-500 text-xs">Manage your data, privacy and session settings.</p>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-800">Data Retention</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Standard (1 year)</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8b1515]" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-sm font-medium text-slate-800">Download My Data</div>
                  <div className="text-[11px] text-slate-500">Export your inspection and activity data</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8b1515]" />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-sm font-medium text-slate-800">Clear Saved Filters</div>
                  <div className="text-[11px] text-slate-500">Remove all saved search filters</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8b1515]" />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-sm font-medium text-slate-800">Privacy Policy</div>
                  <div className="text-[11px] text-slate-500">View our privacy policy</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8b1515]" />
            </div>
          </div>
        </div>

        {/* Card 6: Security */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base">Security</h3>
              <p className="text-slate-500 text-xs">Keep your account secure.</p>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-sm font-medium text-slate-800">Change Password</div>
                  <div className="text-[11px] text-slate-500">Update your account password</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8b1515]" />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <div className="text-sm font-medium text-slate-800">Two-Factor Authentication</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md">Not Enabled</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8b1515]" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <Laptop className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-sm font-medium text-slate-800">Active Sessions</div>
                  <div className="text-[11px] text-slate-500">Manage your active login sessions</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8b1515]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
