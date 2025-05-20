// src/pages/LoginUser.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export default function LoginUser() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);

    try {
      const res = await axios.post('https://voiceboxindia.onrender.com/api/user/signin', form);
      const { token, requiresOTP } = res.data;
      
      localStorage.setItem('token', token);

      if (requiresOTP) {
        navigate('/verify-otp');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      
      // Check if the error message indicates email verification is needed
      if (errorMessage.toLowerCase().includes('verify your email') || 
          errorMessage.toLowerCase().includes('email verification')) {
        setNeedsVerification(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a365d]">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#2c5282]">
            Sign in to access your account
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#c4a777]/20">
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
              {needsVerification && (
                <Link 
                  to="/verify-otp"
                  className="text-[#1a365d] hover:text-[#2c5282] text-sm font-medium inline-flex items-center gap-1 transition-colors duration-200 ml-8"
                >
                  Go to verification page <FiArrowRight className="ml-1" />
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#1a365d]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-[#c4a777]" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-[#c4a777]/30 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-150 ease-in-out bg-slate-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#1a365d]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#c4a777]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-[#c4a777]/30 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-150 ease-in-out bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-[#c4a777] hover:text-[#b38d5f]" />
                  ) : (
                    <FiEye className="h-5 w-5 text-[#c4a777] hover:text-[#b38d5f]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-[#1a365d] hover:bg-[#2c5282] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c4a777] transition duration-150 ease-in-out"
            >
              <FiLogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#2c5282]">
              Don&apos;t have an account?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-[#1a365d] hover:text-[#2c5282] transition duration-150 ease-in-out"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-[#2c5282]">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
