import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiLogIn, FiUserPlus, FiShield, FiInfo, FiMail, FiMessageSquare, FiArrowRight } from 'react-icons/fi';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in text-white">
              Department of Public Services
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Serving Citizens with Excellence and Integrity
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Motivational Quote with 3D Effect */}
        <div className="text-center mb-12 sm:mb-16 transform hover:scale-105 transition-all duration-300">
          <div className="inline-block bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-[#c4a777]/20 hover:shadow-3xl">
            <FiMessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-[#1a365d] mx-auto mb-4" />
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-light text-[#1a365d] italic">
              "Excellence in public service is not just a goal, it's a commitment to our citizens"
            </blockquote>
            <p className="text-[#2c5282] mt-4">- VoiceBox India</p>
          </div>
        </div>

        {/* Authentication Section */}
        {!isLoggedIn ? (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-[#c4a777]/20 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1a365d] mb-8">
              Department Portal Access
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                <FiLogIn className="w-12 h-12 mb-6" />
                <h3 className="text-xl font-semibold mb-4">Sign In</h3>
                <p className="mb-6 text-blue-100">Access your department dashboard and manage complaints efficiently</p>
                <button
                  onClick={() => navigate('/department/login')}
                  className="w-full bg-white text-[#1a365d] px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Sign In <FiArrowRight />
                </button>
              </div>
              <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                <FiUserPlus className="w-12 h-12 mb-6" />
                <h3 className="text-xl font-semibold mb-4">Register Department</h3>
                <p className="mb-6 text-blue-100">Join our network of government departments and serve citizens better</p>
                <button
                  onClick={() => navigate('/department/signup')}
                  className="w-full bg-white text-[#1a365d] px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Register <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-[#c4a777]/20 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1a365d] mb-8">
              Welcome to Your Dashboard
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-6 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                <FiUser className="w-10 h-10 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Profile</h3>
                <p className="text-sm text-blue-100 mb-4">Manage your department profile</p>
                <button
                  onClick={() => navigate('/department/profile')}
                  className="w-full bg-white text-[#1a365d] px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-50 transition-all duration-300"
                >
                  View Profile
                </button>
              </div>
              <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-6 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                <FiMail className="w-10 h-10 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Complaints</h3>
                <p className="text-sm text-blue-100 mb-4">View and manage complaints</p>
                <button
                  onClick={() => navigate('/department/profile')}
                  className="w-full bg-white text-[#1a365d] px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-50 transition-all duration-300"
                >
                  View Complaints
                </button>
              </div>
              <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-6 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                <FiMessageSquare className="w-10 h-10 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Messages</h3>
                <p className="text-sm text-blue-100 mb-4">Check your messages</p>
                <button
                  onClick={() => navigate('/department/profile')}
                  className="w-full bg-white text-[#1a365d] px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-50 transition-all duration-300"
                >
                  View Messages
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About and Privacy Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#c4a777]/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-[#1a365d]/10 p-3 rounded-lg">
                <FiInfo className="w-8 h-8 text-[#1a365d]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a365d]">About Us</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              VoiceBox India is dedicated to bridging the gap between citizens and government departments. 
              We provide a transparent platform for efficient grievance management and citizen engagement.
            </p>
            <button
              onClick={() => navigate('/department/about')}
              className="text-[#1a365d] font-medium hover:text-[#2c5282] transition-colors flex items-center gap-2"
            >
              Learn More <FiArrowRight />
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#c4a777]/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-[#1a365d]/10 p-3 rounded-lg">
                <FiShield className="w-8 h-8 text-[#1a365d]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a365d]">Privacy & Security</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              We take your privacy seriously. Our platform implements industry-standard security measures 
              to protect your data and ensure secure communication.
            </p>
            <button
              onClick={() => navigate('/department/privacy')}
              className="text-[#1a365d] font-medium hover:text-[#2c5282] transition-colors flex items-center gap-2"
            >
              Read More <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
