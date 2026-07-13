import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import StatusBadge from '../components/StatusBadge';
import { Search, Calendar, MapPin, AlertCircle, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrackComplaintPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const [complaintIdInput, setComplaintIdInput] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackIdParam = searchParams.get('id');

  const fetchComplaint = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setComplaint(null);
    try {
      const res = await complaintAPI.track(id);
      if (res.data.success) {
        setComplaint(res.data.complaint);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Complaint not found. Please verify the ID.');
      toast.error('Complaint tracking failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackIdParam) {
      setComplaintIdInput(trackIdParam);
      fetchComplaint(trackIdParam);
    }
  }, [trackIdParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!complaintIdInput.trim()) {
      toast.error('Please enter a valid Complaint ID.');
      return;
    }
    setSearchParams({ id: complaintIdInput.trim() });
  };

  const getStepStatus = (stepName) => {
    if (!complaint) return 'upcoming';
    const statusOrder = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
    const currentIdx = statusOrder.indexOf(complaint.status);
    const stepIdx = statusOrder.indexOf(stepName);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  const steps = [
    { name: 'Submitted', desc: 'Complaint registered by citizen.' },
    { name: 'Under Review', desc: 'Assigned supervisor evaluating details.' },
    { name: 'In Progress', desc: 'Sanitation team dispatched to site.' },
    { name: 'Resolved', desc: 'Leakage/blockage resolved & verified.' }
  ];

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h2 className="section-title">{t('track_title')}</h2>
          <p className="section-subtitle">{t('track_subtitle')}</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              value={complaintIdInput}
              onChange={(e) => setComplaintIdInput(e.target.value)}
              placeholder={t('track_placeholder')} 
              className="w-full pl-11 pr-4 py-3 form-input text-base border-transparent bg-slate-50 dark:bg-slate-900 focus:bg-white focus:border-teal-500 font-semibold"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 bg-gradient-to-r from-blue-900 to-blue-800 hover:bg-blue-850 text-white font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
          >
            {loading ? t('track_searching') : t('track_btn')}
          </button>
        </form>

        {error && (
          <div className="p-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl flex gap-3 text-red-700 dark:text-red-400 text-sm font-semibold animate-scale-in">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Tracking Error</h4>
              <p className="mt-1 font-medium text-red-600 dark:text-red-500">{error}</p>
            </div>
          </div>
        )}

        {/* Tracking Details */}
        {complaint && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Visual Stepper */}
            <div className="card bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6 md:p-8">
              <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-8">Resolution Lifecycle</h3>
              
              <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4">
                
                {/* Horizontal Connector Line for Desktop */}
                <div className="hidden md:block absolute left-[5%] right-[5%] top-[18px] h-0.5 bg-slate-200 dark:bg-slate-700 z-0"></div>

                {steps.map((step, idx) => {
                  const state = getStepStatus(step.name);
                  
                  return (
                    <div key={idx} className="relative z-10 flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-3 flex-1">
                      
                      {/* Step Circle */}
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300
                        ${state === 'completed' ? 'bg-teal-500 text-white' : ''}
                        ${state === 'current' ? 'bg-orange-500 text-white ring-4 ring-orange-500/20 scale-110' : ''}
                        ${state === 'upcoming' ? 'bg-slate-100 dark:bg-slate-700 text-slate-400' : ''}
                      `}>
                        {state === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                      </span>

                      {/* Step Details */}
                      <div className="text-left md:text-center">
                        <h4 className={`text-sm font-bold ${state === 'current' ? 'text-orange-500' : 'text-slate-900 dark:text-white'}`}>{step.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-[150px]">{step.desc}</p>
                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

            {/* Complaint Summary details card */}
            <div className="card bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-400" />
                  <span className="font-bold text-slate-800 dark:text-white">SDMS Complaint Report</span>
                </div>
                <StatusBadge status={complaint.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</h4>
                  <div className="space-y-3.5 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 w-24 shrink-0 font-medium">Complaint ID:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-white">{complaint.complaintId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 w-24 shrink-0 font-medium">Reported By:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{complaint.name}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 w-24 shrink-0 font-medium">Area Location:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{complaint.area}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 w-24 shrink-0 font-medium">Address:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{complaint.address}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 w-24 shrink-0 font-medium">Description:</span>
                      <span className="font-semibold text-slate-800 dark:text-white text-xs">{complaint.description}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Photo Proof</h4>
                    {complaint.photo ? (
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 max-h-44">
                        <img 
                          src={complaint.photo} 
                          alt="Reported problem" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?q=80&w=600&auto=format&fit=crop';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-36 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 text-xs">
                        <AlertCircle className="h-6 w-6 mb-1 text-slate-300" />
                        <span>No photo attachment</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Workers & Remarks</h4>
                <p className="font-semibold text-slate-800 dark:text-white">
                  Workers: <span className="font-normal text-slate-500 dark:text-slate-400">{complaint.assignedWorker || 'None Assigned'}</span>
                </p>
                <p className="font-semibold text-slate-800 dark:text-white mt-1">
                  Municipality Remarks: <span className="font-normal text-slate-500 dark:text-slate-400">{complaint.remarks || 'Under verification.'}</span>
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
