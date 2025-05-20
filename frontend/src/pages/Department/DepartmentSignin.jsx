import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding, FaArrowRight } from 'react-icons/fa';

export default function DepartmentSignin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);

    try {
      const res = await axios.post('http://localhost:5000/api/department/signin', form);
      
      const { token, requiresOTP } = res.data;
      const departmentToken = token;
      localStorage.setItem('token', departmentToken);

      if (requiresOTP) {
        navigate('/department/verify-otp');
      } else {
        navigate('/department/profile');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-[#c4a777]/30 transform transition-all duration-300 hover:shadow-[#c4a777]/20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-4 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
              <FaBuilding className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-sm text-[#2c5282] font-medium">
            Sign in to access your department portal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
            <p className="text-red-700 text-sm font-medium">{error}</p>
            {needsVerification && (
              <div className="mt-2">
                <Link 
                  to="/department/verify-otp"
                  className="text-[#1a365d] hover:text-[#2c5282] text-sm font-medium inline-flex items-center gap-1 transition-colors duration-200"
                >
                  Go to verification page <FaArrowRight className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-[#1a365d] mb-2 group-hover:text-[#2c5282] transition-colors duration-200">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-[#c4a777] group-hover:text-[#b38d5f] transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-4 py-3.5 border border-[#c4a777]/30 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200 ease-in-out hover:border-[#c4a777]/50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-[#1a365d] mb-2 group-hover:text-[#2c5282] transition-colors duration-200">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#c4a777] group-hover:text-[#b38d5f] transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-12 py-3.5 border border-[#c4a777]/30 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200 ease-in-out hover:border-[#c4a777]/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-[#b38d5f] transition-colors duration-200"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-[#c4a777]" />
                  ) : (
                    <FaEye className="h-5 w-5 text-[#c4a777]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-[#1a365d] hover:bg-[#2c5282] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c4a777] transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-[#c4a777]/20"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FaBuilding className="h-5 w-5 text-[#c4a777] group-hover:text-[#b38d5f] transition-colors duration-200" />
              </span>
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c4a777]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#2c5282] font-medium">
                New to the platform?
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/department/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a365d] hover:text-[#2c5282] transition-all duration-200 ease-in-out hover:gap-3"
            >
              Create a department account
              <FaArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
