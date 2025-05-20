import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyOtp() {
  const [form, setForm] = useState({ email: '', otp: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'otp' && !/^\d*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await axios.post('https://voiceboxindia.onrender.com/api/user/resend-otp', {
        email: form.email,
      });
      toast.success('New OTP has been sent to your email');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP';
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { email, otp } = form;
      if (!email || !otp) {
        setError('Please enter both email and OTP.');
        setIsLoading(false);
        return;
      }

      if (!/^\d{6}$/.test(otp)) {
        setError('OTP must be exactly 6 digits');
        setIsLoading(false);
        return;
      }

      const res = await axios.post('https://voiceboxindia.onrender.com/api/user/verify-otp', {
        email,
        otp: Number(otp),
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        toast.success('OTP verified successfully. Redirecting...');
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setError('Unexpected server response');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP verification failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#c4a777]/20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#1a365d] mb-2">Verify Your Email</h2>
          <p className="text-sm text-[#2c5282] mb-8">
            Please enter the OTP sent to your email address to complete the verification process
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1a365d] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-[#c4a777]/30 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-150 ease-in-out bg-slate-50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-[#1a365d] mb-2">
              OTP Code
            </label>
            <input
              id="otp"
              type="tel"
              name="otp"
              required
              value={form.otp}
              onChange={handleChange}
              maxLength={6}
              className="appearance-none block w-full px-4 py-3 border border-[#c4a777]/30 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition duration-150 ease-in-out text-center text-2xl tracking-widest bg-slate-50"
              placeholder="••••••"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white text-sm font-semibold transition duration-150 ease-in-out ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#1a365d] hover:bg-[#2c5282] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c4a777]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading || !form.email}
              className={`text-sm text-[#1a365d] hover:text-[#2c5282] font-medium focus:outline-none ${
                resendLoading || !form.email ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#2c5282]">
            Having trouble? Please make sure to check your spam folder for the OTP email
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
