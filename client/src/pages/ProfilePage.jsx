import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { complaintAPI } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import { User, Phone, MapPin, Mail, Calendar, Edit2, AlertCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0
  });

  const fetchUserComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintAPI.getAll({ limit: 100 });
      if (res.data.success) {
        setComplaints(res.data.complaints);
        
        // Calculate user stats
        const resolved = res.data.complaints.filter(c => c.status === 'Resolved').length;
        const pending = res.data.complaints.filter(c => c.status !== 'Resolved').length;
        
        setStats({
          total: res.data.complaints.length,
          resolved,
          pending
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load complaint history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserComplaints();
  }, []);

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Profile Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Details */}
          <div className="card bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-700/50">
              <div className="w-20 h-20 bg-blue-100 dark:bg-slate-700 text-blue-900 dark:text-teal-400 rounded-full flex items-center justify-center font-black text-2xl mb-4 border-2 border-teal-500 shadow-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-full mt-1 border border-slate-200 dark:border-slate-800">
                {user.role.toUpperCase()}
              </span>
            </div>

            <div className="py-6 space-y-4 text-sm">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{user.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{user.address || 'No address provided'}</span>
              </div>
            </div>

            <button 
              onClick={() => toast('Profile edit feature coming soon!')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-600 transition-all"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit Profile Details
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
              <h4 className="text-2xl font-black text-blue-900 dark:text-teal-400">{stats.total}</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mt-1">Total</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
              <h4 className="text-2xl font-black text-teal-600 dark:text-teal-400">{stats.resolved}</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mt-1">Resolved</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
              <h4 className="text-2xl font-black text-orange-500">{stats.pending}</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mt-1">Pending</p>
            </div>
          </div>

        </div>

        {/* Right Complaints History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t('profile_complaints')}</h2>
            <button 
              onClick={fetchUserComplaints}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <SkeletonLoader type="card" count={3} />
          ) : complaints.length === 0 ? (
            <div className="card text-center py-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700">
              <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{t('profile_no_complaints')}</h3>
              <p className="text-sm max-w-sm mt-1 mb-6">{t('profile_no_complaints_desc')}</p>
              <a href="/report" className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-semibold transition-all">
                {t('profile_report_btn')}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {complaints.map((c) => (
                <ComplaintCard 
                  key={c._id} 
                  complaint={c} 
                  onViewDetails={handleViewComplaint}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Complaint Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedComplaint ? `Complaint Details - ${selectedComplaint.complaintId}` : ''}
      >
        {selectedComplaint && (
          <div className="space-y-6">
            
            {/* Status section */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500">Current Status:</span>
                <StatusBadge status={selectedComplaint.status} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>Reported on: {new Date(selectedComplaint.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Photo & description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Submitted Photo</h4>
                {selectedComplaint.photo ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-60">
                    <img 
                      src={selectedComplaint.photo} 
                      alt="Drainage issue" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-44 rounded-xl bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <span className="text-xs">No image provided</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Description</h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{selectedComplaint.description}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reporter Details</h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold">{selectedComplaint.name}</p>
                  <p className="text-xs text-slate-500">{selectedComplaint.phone}</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-700" />

            {/* Location & remarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location Coordinates</h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Sector Area:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{selectedComplaint.area}</span>
                  </p>
                  <p className="flex justify-between mt-1">
                    <span className="text-slate-500">Address:</span>
                    <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[150px]">{selectedComplaint.address}</span>
                  </p>
                  <p className="flex justify-between mt-1">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="font-mono text-xs text-slate-600 dark:text-teal-400">
                      {selectedComplaint.location.lat.toFixed(4)}, {selectedComplaint.location.lng.toFixed(4)}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Worker Assignment & Remarks</h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Assigned Team:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{selectedComplaint.assignedWorker || 'None Assigned'}</span>
                  </p>
                  <p className="flex justify-between mt-1.5">
                    <span className="text-slate-500">Remarks:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{selectedComplaint.remarks || 'No remarks added yet'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Status History Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Complaint Lifecycle Timeline</h4>
              <div className="relative pl-6 border-l border-slate-200 dark:border-slate-700 space-y-4">
                {selectedComplaint.statusHistory?.map((hist, i) => (
                  <div key={i} className="relative">
                    {/* Circle marker */}
                    <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                    <div className="text-xs flex items-center justify-between font-semibold text-slate-400">
                      <span>Status: <strong className="text-slate-700 dark:text-slate-200">{hist.status}</strong></span>
                      <span>{new Date(hist.changedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{hist.remark}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
