import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, MapPin } from 'lucide-react';
import { issueAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'Road', label: 'Road', desc: 'Potholes, broken streetlights, or signs', icon: '🛣️' },
  { id: 'Water', label: 'Water', desc: 'Leaks, pipe bursts, or quality issues', icon: '💧' },
  { id: 'Electricity', label: 'Electricity', desc: 'Power outages, sparks, or loose wires', icon: '⚡' },
  { id: 'Sanitation', label: 'Sanitation', desc: 'Garbage collection or drainage problems', icon: '🗑️' },
  { id: 'Other', label: 'Other', desc: 'Any other civic issues not listed above', icon: '📋' },
];

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    category: '',
    title: '',
    description: '',
    photo: null,
    photoPreview: '',
    locationAddress: '',
    locationLat: '',
    locationLng: '',
  });

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setForm(p => ({
          ...p,
          locationLat: lat,
          locationLng: lng,
          // Use coordinates as address if user hasn't typed one yet
          locationAddress: p.locationAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        }));
        setLocationLoading(false);
        toast.success('GPS location detected');
      },
      () => {
        toast.error('Could not detect location. Please type your address.');
        setLocationLoading(false);
      }
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, photo: file, photoPreview: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (isDraft = false) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('category', form.category);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('locationAddress', form.locationAddress || 'Location not specified');
      if (form.locationLat) fd.append('locationLat', form.locationLat);
      if (form.locationLng) fd.append('locationLng', form.locationLng);
      if (form.photo) fd.append('photo', form.photo);
      fd.append('draftMode', isDraft);

      const { data } = await issueAPI.create(fd);
      toast.success(isDraft ? 'Draft saved!' : 'Issue reported successfully!');
      navigate(`/track/${data.issue._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-primary">Report Issue</h2>
            <p className="text-xs text-gray-400">Step {step} of 3</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="px-4 pb-24">
        {/* Step 1 — Category */}
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold mb-1 text-primary">Select Category</h3>
            <p className="text-gray-500 text-sm mb-5">What type of issue are you reporting?</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setForm(p => ({ ...p, category: cat.id }))}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${form.category === cat.id ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-2xl mb-2 block">{cat.icon}</span>
                  <p className="font-semibold text-sm">{cat.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-tight">{cat.desc}</p>
                </button>
              ))}
            </div>
            <button disabled={!form.category} onClick={() => setStep(2)} className="btn-primary w-full mt-6">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold mb-1">Issue Details</h3>
            <p className="text-gray-500 text-sm mb-5">Describe the issue clearly</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input className="input" placeholder="e.g. Broken streetlight near park"
                  value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="input h-28 resize-none" placeholder="Provide details about the issue..."
                  value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Photo (optional)</label>
                <input type="file" accept="image/*" ref={fileRef} onChange={handlePhotoChange} className="hidden" />
                {form.photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img src={form.photoPreview} alt="Preview" className="w-full h-40 object-cover" />
                    <button onClick={() => setForm(p => ({ ...p, photo: null, photoPreview: '' }))}
                      className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center text-gray-600 shadow">✕</button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors">
                    <Camera size={28} />
                    <span className="text-sm">Tap to upload photo</span>
                  </button>
                )}
              </div>
            </div>
            <button disabled={!form.title || !form.description}
              onClick={() => { setStep(3); detectLocation(); }} className="btn-primary w-full mt-6">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3 — Location */}
        {step === 3 && (
          <div>
            <h3 className="text-xl font-bold mb-1 text-primary">Confirm Location</h3>
            <p className="text-gray-500 text-sm mb-5">Type your address or use GPS to auto-fill.</p>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
              <div className="flex items-center gap-2 text-primary mb-3">
                <MapPin size={16} />
                {locationLoading
                  ? <span className="text-gray-400 text-sm">Detecting GPS…</span>
                  : <span className="text-sm font-medium">{form.locationAddress || 'No location yet'}</span>
                }
              </div>

              <input className="input text-sm mb-3"
                placeholder="Type full address (e.g. 12 Gandhi Street, Chennai)"
                value={form.locationAddress}
                onChange={e => setForm(p => ({ ...p, locationAddress: e.target.value }))} />

              {form.locationLat && (
                <div className="bg-gray-50 rounded-xl p-3 text-center text-xs text-gray-400 mb-3">
                  📍 GPS: {Number(form.locationLat).toFixed(5)}, {Number(form.locationLng).toFixed(5)}
                </div>
              )}

              <button type="button" onClick={detectLocation}
                className="text-primary text-sm hover:underline">
                📡 Use my current GPS location
              </button>
            </div>

            {/* Summary */}
            <div className="bg-orange-50 rounded-2xl p-4 mb-6">
              <h4 className="font-semibold mb-3">📋 Summary</h4>
              {[
                ['Category', form.category],
                ['Title', form.title],
                ['Description', form.description],
                ['Photo', form.photo ? '✅ Attached' : 'None'],
                ['Location', form.locationAddress || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 py-1.5 border-b border-orange-100 last:border-0">
                  <span className="text-gray-500 text-sm w-24 flex-shrink-0">{k}</span>
                  <span className="text-sm font-medium line-clamp-2">{v}</span>
                </div>
              ))}
            </div>

            <button onClick={() => handleSubmit(false)} disabled={loading || !form.locationAddress}
              className="btn-primary w-full mb-3">
              {loading ? <span className="spinner" /> : 'Submit Report'}
            </button>
            <button onClick={() => handleSubmit(true)} disabled={loading}
              className="w-full text-center text-gray-500 text-sm py-2 hover:text-gray-700">
              Save as Draft
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
