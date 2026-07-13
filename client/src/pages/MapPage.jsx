import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import StatusBadge from '../components/StatusBadge';
import { MapPin, Search, Filter, Layers, Navigation, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import L from 'leaflet';

const AREAS = [
  'Sector 1 - Downtown',
  'Sector 2 - Market Area',
  'Sector 3 - Industrial Zone',
  'Sector 4 - Residential Colony',
  'Sector 5 - Old City',
  'Sector 6 - University Area',
  'Sector 7 - Hospital Road',
  'Sector 8 - Railway Station',
  'Sector 9 - Bus Stand',
  'Sector 10 - Lake View'
];

// Helper to generate dynamic colored SVG markers matching status
const createCustomIcon = (status) => {
  let color = '#3B82F6'; // Submitted
  if (status === 'Under Review') color = '#F97316';
  if (status === 'In Progress') color = '#EAB308';
  if (status === 'Resolved') color = '#22C55E';

  const html = `
    <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: ${color}22; border: 2px solid ${color}; border-radius: 50%; padding: 4px; box-shadow: 0 0 10px ${color}55;">
      <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function MapPage() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [area, setArea] = useState('all');

  useEffect(() => {
    async function loadMapData() {
      try {
        const res = await complaintAPI.getMapData();
        if (res.data.success) {
          setComplaints(res.data.complaints);
          setFilteredComplaints(res.data.complaints);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load map complaint markers.');
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  // Filter Trigger logic
  useEffect(() => {
    let result = complaints;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.complaintId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }

    if (status !== 'all') {
      result = result.filter(c => c.status === status);
    }

    if (area !== 'all') {
      result = result.filter(c => c.area === area);
    }

    setFilteredComplaints(result);
  }, [search, status, area, complaints]);

  return (
    <div className="relative h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sidebar Controls Panel */}
      <div className="w-full md:w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-10 shrink-0 shadow-lg">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm uppercase tracking-wider">
            <Layers className="h-4 w-4 text-teal-400" /> Map Filters
          </h3>
          <span className="text-[10px] px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded-full font-bold uppercase tracking-wider">
            {filteredComplaints.length} Pins
          </span>
        </div>

        <div className="p-5 flex-grow overflow-y-auto space-y-5">
          {/* Keyword Search */}
          <div className="form-group mb-0">
            <label className="form-label">Search Keyword</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ID, Address, detail..." 
                className="w-full pl-9 pr-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-semibold placeholder-slate-400 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Status Select */}
          <div className="form-group mb-0">
            <label className="form-label">Status Filter</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Area Select */}
          <div className="form-group mb-0">
            <label className="form-label">Area Filter</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Areas</option>
              {AREAS.map((a, idx) => (
                <option key={idx} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Legend widget */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] space-y-2">
            <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-2">Map Legend</h4>
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
              <span className="text-slate-600 dark:text-slate-400">Submitted</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
              <span className="text-slate-600 dark:text-slate-400">Under Review</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
              <span className="text-slate-600 dark:text-slate-400">In Progress</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
              <span className="text-slate-600 dark:text-slate-400">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="flex-grow h-full w-full z-0 relative">
        {loading ? (
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-400">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('map_loading')}</span>
          </div>
        ) : (
          <MapContainer center={[17.3850, 78.4867]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredComplaints.map((c) => {
              if (!c.location || isNaN(c.location.lat) || isNaN(c.location.lng)) return null;
              
              return (
                <Marker 
                  key={c._id} 
                  position={[c.location.lat, c.location.lng]} 
                  icon={createCustomIcon(c.status)}
                >
                  <Popup>
                    <div className="p-1 space-y-3 w-56 font-sans">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="font-mono text-xs font-bold text-blue-900">{c.complaintId}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p className="font-bold text-slate-800 leading-tight">{c.area}</p>
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate">{c.address}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg">
                        {c.description}
                      </p>

                      <Link 
                        to={`/track?id=${c.complaintId}`}
                        className="block text-center py-1.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold text-[10px] rounded-lg shadow-sm hover:translate-y-[-1px] transition-all"
                      >
                        {t('nav_track')}
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

    </div>
  );
}
