import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { stateDistrictData } from "../../stateDistrictData.js";
import { FiSearch, FiMapPin, FiStar, FiMail, FiPhone, FiMessageSquare, FiAlertCircle, FiEye, FiUsers, FiShield, FiCheckCircle, FiArrowRight } from "react-icons/fi";

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      let url = "https://voiceboxindia.onrender.com/api/department/departments?";
      if (state) url += `state=${encodeURIComponent(state)}&`;
      if (district) url += `district=${encodeURIComponent(district)}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

      const res = await axios.get(url);
      setDepartments(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-filter when state or district changes
  useEffect(() => {
    fetchDepartments();
  }, [state, district]);

  const handleSearch = () => {
    setSearchParams({ state, district, search: searchTerm });
    fetchDepartments();
  };

  // Update state and district from URL params on initial load
  useEffect(() => {
    const stateParam = searchParams.get('state');
    const districtParam = searchParams.get('district');
    const searchParam = searchParams.get('search');

    if (stateParam) setState(stateParam);
    if (districtParam) setDistrict(districtParam);
    if (searchParam) setSearchTerm(searchParam);
  }, []);

  const handleRaiseComplaint = (id) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    navigate(`/complaint/raise/${id}`);
  };

  const handleSeeReviews = (id) => {
    navigate(`/review/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in text-white">
              VoiceBox India
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Empowering Citizens, Strengthening Governance
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-[#c4a777] hover:bg-[#b38d5f] text-white px-6 sm:px-8 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                Get Started <FiArrowRight />
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 transform hover:scale-105 transition-all duration-300 border border-[#c4a777]/20 shadow-lg">
              <FiUsers className="w-10 h-10 sm:w-12 sm:h-12 text-[#c4a777] mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Citizen Empowerment</h3>
              <p className="text-blue-100">Register and raise complaints with ease, track progress in real-time</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 transform hover:scale-105 transition-all duration-300 border border-[#c4a777]/20 shadow-lg">
              <FiShield className="w-10 h-10 sm:w-12 sm:h-12 text-[#c4a777] mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Secure Platform</h3>
              <p className="text-blue-100">Verified departments, secure communication channels</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 transform hover:scale-105 transition-all duration-300 border border-[#c4a777]/20 shadow-lg">
              <FiCheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-[#c4a777] mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">AI-Powered</h3>
              <p className="text-blue-100">Smart complaint generation in English and Hindi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Motivational Quote */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#c4a777]/20">
            <FiMessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-[#1a365d] mx-auto mb-4" />
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-light text-[#1a365d] italic">
              "Together we can build a more responsive and accountable governance system"
            </blockquote>
            <p className="text-[#2c5282] mt-4">- VoiceBox India</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl mb-12 sm:mb-16 border border-[#c4a777]/20">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#1a365d] mb-6 sm:mb-8">
            Find Your Department
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center">
            <div className="relative flex-1">
              <select
                value={state}
                onChange={(e) => {
                  setDistrict("");
                  setState(e.target.value);
                }}
                className="w-full border border-[#c4a777]/30 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200 bg-slate-50 appearance-none"
              >
                <option value="">Select State</option>
                {Object.keys(stateDistrictData).map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a365d]" />
            </div>

            <div className="relative flex-1">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-[#c4a777]/30 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200 bg-slate-50 appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                disabled={!state}
              >
                <option value="">Select District</option>
                {state &&
                  stateDistrictData[state]?.map((districtName) => (
                    <option key={districtName} value={districtName}>
                      {districtName}
                    </option>
                  ))}
              </select>
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a365d]" />
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-[#c4a777]/30 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200 bg-slate-50"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a365d]" />
            </div>

            <button
              onClick={handleSearch}
              className="bg-[#1a365d] hover:bg-[#2c5282] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
            >
              <FiSearch className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Loading and No Results States */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#c4a777]"></div>
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-3xl shadow-xl border border-[#c4a777]/20">
            <FiAlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-[#1a365d] mx-auto mb-6" />
            <p className="text-xl sm:text-2xl text-[#1a365d] font-medium">No departments found</p>
            <p className="text-[#2c5282] mt-3">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {departments.map((department) => (
              <div
                key={department._id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#c4a777]/20"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Department Image */}
                  <div className="md:w-1/4 relative">
                    {department?.photo ? (
                      <img
                        src={department.photo}
                        alt="Department"
                        className="w-full h-48 md:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 md:h-full bg-gradient-to-br from-[#1a365d] to-[#2c5282] flex items-center justify-center text-6xl text-white font-medium">
                        {department?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Department Details */}
                  <div className="md:w-3/4 p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1a365d] mb-2 md:mb-0">
                        {department?.name}
                      </h2>
                      <div className="flex items-center space-x-1 bg-slate-50 px-4 py-2 rounded-full">
                        {[...Array(5)].map((_, index) => (
                          <FiStar
                            key={index}
                            className={`w-5 h-5 ${index < department?.averageRating
                                ? "text-[#c4a777] fill-current"
                                : "text-gray-300"
                              }`}
                          />
                        ))}
                        <span className="ml-2 font-semibold text-[#1a365d]">
                          {department?.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        {[
                          { label: "Email", value: department?.email, icon: FiMail },
                          { label: "Phone", value: department?.phone || "N/A", icon: FiPhone },
                          { label: "WhatsApp", value: department?.whatsapp || "N/A", icon: FiMessageSquare },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <item.icon className="w-4 h-4 text-[#1a365d]" />
                            <span className="font-semibold text-[#1a365d] min-w-[80px]">{item.label}:</span>
                            <span className="text-[#2c5282]">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm">
                          <FiMapPin className="w-4 h-4 text-[#1a365d]" />
                          <span className="font-semibold text-[#1a365d] min-w-[80px]">Location:</span>
                          <span className="text-[#2c5282]">{department?.district}, {department?.state}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <h3 className="font-semibold text-[#1a365d] mb-2 flex items-center gap-2">
                            <FiMapPin className="w-4 h-4 text-[#1a365d]" />
                            Working Areas
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {department?.workingAreas?.map((area, index) => (
                              <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-[#2c5282] border border-[#c4a777]/30">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleRaiseComplaint(department._id)}
                        className="flex-1 bg-[#1a365d] hover:bg-[#2c5282] text-white px-6 py-3 rounded-xl transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <FiAlertCircle className="w-4 h-4" />
                        Raise Complaint
                      </button>
                      <button
                        onClick={() => handleSeeReviews(department._id)}
                        className="flex-1 bg-[#c4a777] hover:bg-[#b38d5f] text-white px-6 py-3 rounded-xl transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <FiEye className="w-4 h-4" />
                        See Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
