import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { stateDistrictData } from '../../stateDistrictData.js';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaShieldAlt, FaUserShield, FaCheckCircle, FaTimes } from 'react-icons/fa';

export default function SignupUser() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    state: '',
    district: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [districts, setDistricts] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (form.state) {
      setDistricts(stateDistrictData[form.state] || []);
      setForm(prev => ({ ...prev, district: '' }));
    }
  }, [form.state]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/user/signup', form);
      setSuccess('Signup successful! Please check your email for the OTP.');
      setTimeout(() => navigate('/verify-otp', { state: { email: form.email } }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left side - Features and Benefits */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-xl p-8 h-full flex flex-col border border-[#c4a777]/20">
              <div className="text-center mb-8">
                <FaUserShield className="w-16 h-16 text-[#c4a777] mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-[#1a365d] mb-2">Citizen Portal</h2>
                <p className="text-[#2c5282]">Your Voice Matters - Connect with Government Departments</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FaShieldAlt className="w-6 h-6 text-[#c4a777] mt-1" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a365d]">Secure Platform</h3>
                    <p className="text-[#2c5282]">Your data is protected with advanced security measures</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FaCheckCircle className="w-6 h-6 text-[#c4a777] mt-1" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a365d]">Verified Access</h3>
                    <p className="text-[#2c5282]">OTP-based verification for secure account creation</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FaUser className="w-6 h-6 text-[#c4a777] mt-1" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a365d]">Easy Communication</h3>
                    <p className="text-[#2c5282]">Direct access to government departments for your concerns</p>
                  </div>
                </div>
              </div>

              <blockquote className="mt-8 border-l-4 border-[#c4a777] pl-4 py-2 bg-slate-50 rounded-r-lg">
                <p className="text-[#1a365d] italic text-lg">
                  "Empowering citizens through digital engagement and transparent governance."
                </p>
                <footer className="text-[#2c5282] mt-2">- Digital India Initiative</footer>
              </blockquote>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-full border border-[#c4a777]/20">
              <div className="px-8 py-10">
                <div className="text-center mb-8">
                  <FaUser className="w-12 h-12 text-[#c4a777] mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-[#1a365d] mb-2">Create Your Account</h2>
                  <p className="text-[#2c5282]">Join our community of engaged citizens</p>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
                    <FaTimes className="text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-[#1a365d] flex items-center gap-2">
                      <FaUser className="text-[#c4a777]" />
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      required
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#c4a777]/30 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400 text-[#1a365d] bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[#1a365d] flex items-center gap-2">
                      <FaEnvelope className="text-[#c4a777]" />
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#c4a777]/30 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400 text-[#1a365d] bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-[#1a365d] flex items-center gap-2">
                      <FaLock className="text-[#c4a777]" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#c4a777]/30 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400 text-[#1a365d] bg-slate-50 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#c4a777] hover:text-[#b38d5f] focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm font-medium text-[#1a365d] flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#c4a777]" />
                        State
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#c4a777]/30 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-200 ease-in-out text-[#1a365d] bg-slate-50"
                      >
                        <option value="">Select State</option>
                        {Object.keys(stateDistrictData).map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="district" className="text-sm font-medium text-[#1a365d] flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#c4a777]" />
                        District
                      </label>
                      <select
                        id="district"
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        required
                        disabled={!form.state}
                        className="w-full px-4 py-3 rounded-xl border border-[#c4a777]/30 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-200 ease-in-out text-[#1a365d] bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[#1a365d] hover:bg-[#2c5282] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-[#c4a777] flex items-center justify-center gap-2"
                  >
                    <FaUserShield className="w-5 h-5" />
                    Create Account
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-[#2c5282]">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="font-medium text-[#1a365d] hover:text-[#2c5282] transition duration-150 ease-in-out"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-[#c4a777]/20">
                <p className="text-xs text-center text-[#2c5282]">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
