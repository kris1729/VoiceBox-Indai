import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaCamera, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { stateDistrictData } from "../../stateDistrictData.js";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    state: '',
    district: '',
    photo: null,
  });
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch current user details on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('https://voiceboxindia.onrender.com/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && res.data.data) {
          const user = res.data.data;
          setForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            state: user.state || '',
            district: user.district || '',
            photo: null,
          });
          // Set districts based on the loaded state
          if (user.state) {
            setDistricts(stateDistrictData[user.state] || []);
          }
        } else {
          setError('Failed to load user data');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user data');
        setLoading(false);
      });
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle state change to load districts
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setForm((prev) => ({
      ...prev,
      state: selectedState,
      district: "", // Reset district on state change
    }));

    // Load the districts for the selected state
    setDistricts(stateDistrictData[selectedState] || []);
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (form.password) formData.append('password', form.password);
      formData.append('state', form.state);
      formData.append('district', form.district);
      if (form.photo) formData.append('photo', form.photo);

      const res = await axios.put(
        'https://voiceboxindia.onrender.com/api/user/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Check if email was changed and needs verification
      if (res.data.message.toLowerCase().includes('verify your new email')) {
        // Store the new email temporarily
        localStorage.setItem('pendingEmail', form.email);
        alert(res.data.message);
        navigate('/verify-otp');
      } else {
        alert(res.data.message);
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a365d]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#c4a777]/20">
          <div className="px-6 py-4 bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#1a365d] flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <button
              onClick={() => navigate('/profile')}
              className="text-white hover:text-[#c4a777] transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-[#1a365d]" />
                    <span>Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-[#c4a777]/30 rounded-xl focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-[#1a365d]" />
                    <span>Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-[#c4a777]/30 rounded-xl focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaLock className="text-[#1a365d]" />
                    <span>Password (leave blank to keep unchanged)</span>
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#c4a777]/30 rounded-xl focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1a365d] hover:text-[#2c5282]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* State Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#1a365d]" />
                    <span>State</span>
                  </div>
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleStateChange}
                  required
                  className="w-full p-2 border border-[#c4a777]/30 rounded-xl focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                >
                  <option value="">Select State</option>
                  {Object.keys(stateDistrictData).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#1a365d]" />
                    <span>District</span>
                  </div>
                </label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  required
                  disabled={!form.state}
                  className="w-full p-2 border border-[#c4a777]/30 rounded-xl focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all disabled:bg-slate-50"
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaCamera className="text-[#1a365d]" />
                    <span>Profile Photo</span>
                  </div>
                </label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full p-2 border border-[#c4a777]/30 rounded-xl focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-[#1a365d] hover:bg-[#2c5282] text-white font-medium py-3 px-4 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:ring-offset-2
                transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
