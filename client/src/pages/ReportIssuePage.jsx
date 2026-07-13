import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { complaintAPI } from '../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, Upload, AlertCircle, FileText, CheckCircle2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import L from 'leaflet';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

export default function ReportIssuePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    description: '',
    area: AREAS[0]
  });

  const [location, setLocation] = useState({
    lat: 17.3850,
    lng: 78.4867
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState(false);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        setFormData(prev => ({
          ...prev,
          address: data.display_name
        }));
        toast.success(t('report_address_autofill'));
      }
    } catch (err) {
      console.error('Failed to fetch address:', err);
    }
  };

  // Map Click Handler Component
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
        fetchAddress(e.latlng.lat, e.latlng.lng);
        toast.success(t('report_coords_updated'));
      },
    });

    return (
      <Marker position={location} />
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('report_file_size'));
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoError(false);
    }
  };

  const captureGPSLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t('report_gps_unsupported'));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocating(false);
        toast.success(t('report_loc_captured'));
        fetchAddress(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setLocating(false);
        toast.error(t('report_gps_fail'));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address, description, area } = formData;

    if (!name || !phone || !address || !description) {
      setError(t('report_err_fields'));
      return;
    }

    // Mandatory photo check
    if (!photo) {
      setError(t('report_err_photo'));
      setPhotoError(true);
      toast.error(t('report_err_photo'));
      return;
    }

    setError('');
    setPhotoError(false);
    setLoading(true);

    const postData = new FormData();
    postData.append('name', name);
    postData.append('phone', phone);
    postData.append('address', address);
    postData.append('description', description);
    postData.append('area', area);
    postData.append('lat', location.lat);
    postData.append('lng', location.lng);
    postData.append('photo', photo);

    try {
      const res = await complaintAPI.create(postData);
      if (res.data.success) {
        toast.success(res.data.message || t('report_success'));
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit complaint. Please check form fields.');
      toast.error(t('report_fail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h2 className="section-title">{t('report_title')}</h2>
          <p className="section-subtitle">{t('report_subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex gap-3 text-red-700 dark:text-red-400 text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="card bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">{t('report_contact_title')}</h3>
            
            <div className="form-group mb-0">
              <label className="form-label">{t('report_name')}</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('report_name_ph')} 
                className="w-full form-input"
                required
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">{t('report_phone')}</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t('report_phone_ph')} 
                className="w-full form-input"
                required
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">{t('report_area')}</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full form-input cursor-pointer"
              >
                {AREAS.map((a, idx) => (
                  <option key={idx} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">{t('report_address')}</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={t('report_address_ph')} 
                className="w-full form-input"
                required
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">{t('report_desc')}</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('report_desc_ph')} 
                className="w-full form-input form-textarea"
                required
              ></textarea>
            </div>
          </div>

          {/* Right Map/Photo Column */}
          <div className="space-y-6">
            
            {/* Photo upload card - MANDATORY */}
            <div className={`card bg-white dark:bg-slate-800 p-6 transition-all ${
              photoError 
                ? 'border-2 border-red-400 dark:border-red-500 shadow-red-100 dark:shadow-red-900/20 shadow-lg' 
                : 'border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="h-5 w-5 text-orange-500" />
                  {t('report_photo_title')}
                </h3>
                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-full">
                  ★ {t('report_photo_required')}
                </span>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                {photoPreview ? (
                  <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-4 bg-slate-100">
                    <img src={photoPreview} alt="Issue preview" className="w-full h-full object-contain" />
                    <button 
                      type="button" 
                      onClick={() => { setPhoto(null); setPhotoPreview(''); setPhotoError(true); }}
                      className="absolute top-2 right-2 px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-all shadow-md"
                    >
                      {t('report_photo_remove')}
                    </button>
                  </div>
                ) : (
                  <label className={`w-full h-36 flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer p-4 transition-all mb-4 ${
                    photoError 
                      ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-950/10 hover:border-red-500' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}>
                    <Upload className={`h-8 w-8 mb-2 ${photoError ? 'text-red-400' : 'text-slate-400'}`} />
                    <span className={`text-xs font-semibold ${photoError ? 'text-red-500' : 'text-slate-500'}`}>{t('report_photo_drag')}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{t('report_photo_format')}</span>
                    {photoError && (
                      <span className="text-[11px] text-red-500 font-bold mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {t('report_err_photo')}
                      </span>
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* GPS Map card */}
            <div className="card bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('report_gps_title')}</h3>
                <button 
                  type="button" 
                  onClick={captureGPSLocation}
                  disabled={locating}
                  className="flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 border border-teal-200 dark:border-teal-900 rounded-lg text-xs font-bold hover:bg-teal-100 transition-all"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  {locating ? t('report_gps_capturing') : t('report_gps_btn')}
                </button>
              </div>

              {/* Leaflet container */}
              <div className="h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-3 z-0">
                <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>

              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-xl p-3 text-[11px] font-mono text-slate-500">
                <span>Lat: {location.lat.toFixed(6)}</span>
                <span>Lng: {location.lng.toFixed(6)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-650 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              {loading ? t('report_submitting') : t('report_submit')} <CheckCircle2 className="h-5 w-5" />
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
