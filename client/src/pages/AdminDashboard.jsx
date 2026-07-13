import React, { useState, useEffect } from 'react';
import { adminAPI, complaintAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SearchFilter from '../components/SearchFilter';
import SkeletonLoader from '../components/SkeletonLoader';
import StatsCard from '../components/StatsCard';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  FileText, CheckCircle2, Clock, Users, ArrowRight, ShieldAlert, 
  MapPin, Eye, RefreshCw, Clipboard, Download, Edit2, AlertCircle, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  'Submitted': '#3B82F6',
  'Under Review': '#F97316',
  'In Progress': '#EAB308',
  'Resolved': '#22C55E'
};

const WORKERS = [
  'Team Alpha - Ramesh', 'Team Beta - Sunil', 'Team Gamma - Prakash',
  'Team Delta - Mohan', 'Team Epsilon - Ravi'
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [area, setArea] = useState('all');
  const [page, setPage] = useState(1);

  // Selected Detail Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Action fields
  const [actionStatus, setActionStatus] = useState('');
  const [actionWorker, setActionWorker] = useState('');
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await complaintAPI.getStats();
      const analyticsRes = await complaintAPI.getAnalytics();
      
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data.');
    }
  };

  const fetchComplaintsList = async () => {
    try {
      const res = await complaintAPI.getAll({
        search,
        status,
        area,
        page,
        limit: 10
      });
      if (res.data.success) {
        setComplaints(res.data.complaints);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve complaints list.');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchDashboardData();
      await fetchComplaintsList();
      setLoading(false);
    };
    init();
  }, [search, status, area, page]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchDashboardData();
    await fetchComplaintsList();
    setLoading(false);
    toast.success('Dashboard data refreshed!');
  };

  const handleOpenDetail = (complaint) => {
    setSelectedComplaint(complaint);
    setActionStatus(complaint.status);
    setActionWorker(complaint.assignedWorker || '');
    setActionRemarks(complaint.remarks || '');
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    setActionLoading(true);
    try {
      const res = await complaintAPI.updateStatus(selectedComplaint._id, {
        status: actionStatus,
        remarks: actionRemarks
      });
      if (res.data.success) {
        toast.success('Complaint status updated successfully!');
        setSelectedComplaint(res.data.complaint);
        fetchDashboardData();
        fetchComplaintsList();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignWorker = async () => {
    if (!selectedComplaint) return;
    setActionLoading(true);
    try {
      const res = await complaintAPI.assignWorker(selectedComplaint._id, {
        worker: actionWorker,
        remarks: actionRemarks
      });
      if (res.data.success) {
        toast.success(`Assigned worker: ${actionWorker}`);
        setSelectedComplaint(res.data.complaint);
        fetchDashboardData();
        fetchComplaintsList();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign worker.');
    } finally {
      setActionLoading(false);
    }
  };

  // PDF Export of reports
  const handleDownloadPDF = () => {
    const printContent = document.getElementById('complaints-table-print-area');
    if (!printContent) return;
    
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif;">
        <h1 style="color: #1E3A8A; font-weight: bold; margin-bottom: 8px;">Smart Drainage Management System</h1>
        <p style="color: #64748B; font-size: 14px; margin-bottom: 24px;">Generated Report — Date: ${new Date().toLocaleDateString()}</p>
        ${printContent.innerHTML}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Refresh to restore React bindings
  };

  return (
    <div className="container py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Municipality Control Room</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review status, allocate cleaning crew, and view area-wise analytics.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            <RefreshCw className="h-4 w-4" /> Refresh Control
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-650 hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/10 transition-all"
          >
            <Download className="h-4 w-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Top statistics widgets */}
      {loading ? (
        <SkeletonLoader type="stats" count={4} />
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard icon={FileText} title="Total Complaints" value={stats.total} colorClass="text-blue-900 dark:text-blue-400" bgColorClass="bg-blue-50 dark:bg-blue-950/30" />
          <StatsCard icon={Clock} title="Pending Reports" value={stats.pending} colorClass="text-orange-500 dark:text-orange-400" bgColorClass="bg-orange-50 dark:bg-orange-950/30" />
          <StatsCard icon={Clipboard} title="Under Action" value={stats.inProgress} colorClass="text-yellow-600 dark:text-yellow-400" bgColorClass="bg-yellow-50 dark:bg-yellow-950/30" />
          <StatsCard icon={CheckCircle2} title="Resolved Issues" value={stats.resolved} colorClass="text-teal-600 dark:text-teal-400" bgColorClass="bg-teal-50 dark:bg-teal-950/30" />
        </div>
      ) : null}

      {/* Recharts Analytics Visualization */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-80 rounded-2xl"></div>
          <div className="skeleton h-80 rounded-2xl col-span-2"></div>
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pie Chart: Status distribution */}
          <div className="card bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between h-80">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Complaint Distribution</h4>
            <div className="flex-grow w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.statusDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={STATUS_COLORS[entry.name] || '#6B7280'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} complaints`, 'Total']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold mt-4 justify-center">
              {analytics.statusDistribution.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name] }}></span>
                  <span className="text-slate-500">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart: Complaints by Area */}
          <div className="card bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6 h-80 col-span-1 lg:col-span-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Area Wise Distribution</h4>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.areaWise}>
                  <XAxis dataKey="area" tick={{ fontSize: 9 }} stroke="#64748B" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#64748B" />
                  <Tooltip cursor={{ fill: 'rgba(20, 184, 166, 0.05)' }} />
                  <Bar dataKey="complaints" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : null}

      {/* Main Filter & Table Area */}
      <SearchFilter 
        search={search}
        status={status}
        area={area}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onAreaChange={setArea}
      />

      {/* Complaints Listing Table */}
      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <div className="card bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden p-0 animate-fade-in">
          
          <div className="overflow-x-auto w-full" id="complaints-table-print-area">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700/50">
                <tr>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Complaint ID</th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Reporter Info</th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Sector Area</th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Specific Address</th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Assigned Team</th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400 font-semibold">
                      No complaints matched the criteria.
                    </td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-all font-semibold">
                      <td className="p-4 font-mono font-bold text-blue-900 dark:text-teal-400">{c.complaintId}</td>
                      <td className="p-4">
                        <div className="text-slate-800 dark:text-white leading-tight font-bold">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{c.phone}</div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-bold">{c.area}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium max-w-[150px] truncate">{c.address}</td>
                      <td className="p-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-semibold">{c.assignedWorker || 'Unassigned'}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleOpenDetail(c)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5" /> Action
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-xs font-bold">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <span className="text-slate-400 font-semibold">Page {pagination.page} of {pagination.pages}</span>
              <button 
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
                className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          )}

        </div>
      )}

      {/* Admin Operations Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedComplaint ? `Manage Complaint - ${selectedComplaint.complaintId}` : ''}
      >
        {selectedComplaint && (
          <div className="space-y-6">
            
            {/* Visual Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Complaint Proof Screenshot</h4>
                {selectedComplaint.photo ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48">
                    <img 
                      src={selectedComplaint.photo} 
                      alt="Drainage issue screenshot" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-36 rounded-xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-xs">
                    No attachment provided.
                  </div>
                )}
              </div>

              <div className="space-y-3.5 text-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report details</h4>
                <p className="font-semibold">Name: <span className="font-normal text-slate-500">{selectedComplaint.name}</span></p>
                <p className="font-semibold">Phone: <span className="font-normal text-slate-500">{selectedComplaint.phone}</span></p>
                <p className="font-semibold">Sector: <span className="font-normal text-slate-500">{selectedComplaint.area}</span></p>
                <p className="font-semibold">Address: <span className="font-normal text-slate-500">{selectedComplaint.address}</span></p>
                <p className="font-semibold">Coordinates: <span className="font-mono text-xs text-teal-400">{selectedComplaint.location.lat.toFixed(4)}, {selectedComplaint.location.lng.toFixed(4)}</span></p>
                <p className="font-semibold">Detail: <span className="font-normal text-slate-500 leading-normal">{selectedComplaint.description}</span></p>
              </div>
            </div>

            {/* Action Operations form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div>
                  <label className="form-label text-slate-400">Resolution Status</label>
                  <select 
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value)}
                    className="w-full mt-1.5 form-input cursor-pointer"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <button 
                  onClick={handleUpdateStatus}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                >
                  {actionLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label text-slate-400">Assign Maintenance Crew</label>
                  <select 
                    value={actionWorker}
                    onChange={(e) => setActionWorker(e.target.value)}
                    className="w-full mt-1.5 form-input cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {WORKERS.map((w, idx) => (
                      <option key={idx} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleAssignWorker}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-teal-650 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                >
                  {actionLoading ? 'Allocating...' : 'Assign Worker'}
                </button>
              </div>
            </div>

            {/* Remarks textarea */}
            <div className="form-group mb-0 text-sm">
              <label className="form-label text-slate-400">Action Remarks & Feedback (Citizen Visible)</label>
              <textarea 
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder="Enter status update details, timelines, resolution description..."
                className="w-full mt-1.5 form-input min-h-[80px]"
              ></textarea>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
