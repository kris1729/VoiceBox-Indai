import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt, FaUser, FaComment, FaTrash } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";

const ReviewPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [complaintId, setComplaintId] = useState("");
  const [user, setUser] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [page, setPage] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartment();
    fetchComments();
    fetchProfile();
  }, []);

  const fetchDepartment = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/department/${id}`);
      setDepartment(res.data.data);
    } catch (err) {
      console.error("Error fetching department", err);
    }
  };

  const fetchProfile = async () => {
    if (!token) return setUser(null);
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comment/${id}`);
      setComments(res.data.comments || res.data.data || []);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const handleAddComment = async () => {
    if (!token) return navigate("/login");
    if (!/^\w{6}$/.test(complaintId) || !newComment.trim() || rating < 1 || rating > 5) {
      return alert("Please provide a valid 6-character Complaint ID, comment, and rating (1-5).");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/comment/${id}`,
        {
          complaintId,
          text: newComment.trim(),
          rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewComment("");
      setComplaintId("");
      setRating(0);
      await fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!token) return navigate("/login");

    try {
      await axios.delete(`http://localhost:5000/api/comment/${id}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const COMMENTS_PER_PAGE = 4;
  const paginatedComments = comments.slice(page * COMMENTS_PER_PAGE, (page + 1) * COMMENTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-8 px-4 sm:px-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-[#1a365d] tracking-tight">Department Reviews & Feedback</h2>
          <p className="text-[#2c5282] italic text-lg">"Excellence in service is not an act, but a habit"</p>
          <div className="w-24 h-1 bg-[#1a365d] mx-auto rounded-full"></div>
        </div>

        {department && (
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 border border-[#c4a777]/20 transition-all duration-300 hover:shadow-2xl">
            {/* Left Section - Department Image and Basic Info */}
            <div className="lg:w-1/3 space-y-6">
              <div className="relative w-full group">
                {department?.photo ? (
                  <img
                    src={department.photo}
                    alt="Department Profile"
                    className="w-full h-80 rounded-2xl object-cover shadow-xl border-4 border-[#1a365d] transform transition-all duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-80 rounded-2xl bg-gradient-to-br from-[#1a365d] to-[#2c5282] flex items-center justify-center transform transition-all duration-300 group-hover:scale-[1.02]">
                    <span className="text-7xl text-white font-bold">
                      {department?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-2xl"></div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`w-6 h-6 transform transition-transform duration-300 hover:scale-110 ${index < department?.averageRating ? "text-yellow-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-[#2c5282]">
                    {department?.averageRating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-[#1a365d] tracking-tight mb-2">
                    {department?.name}
                  </h1>
                  <p className="text-[#2c5282] italic">"Dedicated to Excellence, Committed to Service"</p>
                </div>
              </div>
            </div>
            {/* Right Section - Department Details */}
            <div className="lg:w-2/3 space-y-6 mt-8 lg:mt-0">
              {/* Contact Information Card */}
              <div className="bg-slate-50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#1a365d] mb-6 flex items-center border-b border-slate-200 pb-3">
                  <FaEnvelope className="h-6 w-6 mr-2" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-[#1a365d] bg-opacity-10 rounded-lg flex-shrink-0">
                        <FaEnvelope className="h-5 w-5 text-[#1a365d]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#1a365d]">Email Address</h3>
                        <p className="text-[#2c5282] mt-1 break-all overflow-hidden text-ellipsis">{department?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-[#1a365d] bg-opacity-10 rounded-lg flex-shrink-0">
                        <FaPhone className="h-5 w-5 text-[#1a365d]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#1a365d]">Phone Number</h3>
                        <p className="text-[#2c5282] mt-1 break-all overflow-hidden text-ellipsis">{department?.phone || 'Not Available'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-[#1a365d] bg-opacity-10 rounded-lg flex-shrink-0">
                        <FaWhatsapp className="h-5 w-5 text-[#1a365d]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#1a365d]">WhatsApp</h3>
                        <p className="text-[#2c5282] mt-1 break-all overflow-hidden text-ellipsis">{department?.whatsapp || 'Not Available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Location Information Card */}
              <div className="bg-slate-50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#1a365d] mb-6 flex items-center border-b border-slate-200 pb-3">
                  <FaMapMarkerAlt className="h-6 w-6 mr-2" />
                  Location Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-[#1a365d] bg-opacity-10 rounded-lg">
                        <FaMapMarkerAlt className="h-5 w-5 text-[#1a365d]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[#1a365d]">State</h3>
                        <p className="text-[#2c5282] mt-1">{department?.state}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-[#1a365d] bg-opacity-10 rounded-lg">
                        <FaMapMarkerAlt className="h-5 w-5 text-[#1a365d]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[#1a365d]">District</h3>
                        <p className="text-[#2c5282] mt-1">{department?.district}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Service Areas Card */}
              <div className="bg-slate-50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#1a365d] mb-6 flex items-center border-b border-slate-200 pb-3">
                  <FaMapMarkerAlt className="h-6 w-6 mr-2" />
                  Service Areas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {department?.workingAreas?.map((area, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a365d] text-white flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-[#2c5282] font-medium">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Comment Form */}
          <div className="bg-white/90 backdrop-blur-lg p-5 rounded-3xl shadow-xl border col-span-1 border-[#c4a777]/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[#1a365d] bg-clip-text text-transparent bg-gradient-to-r from-[#1a365d] to-[#2c5282]">
                Share Your Experience
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your feedback helps us improve our services
              </p>
            </div>

            {!token ? (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                    <FiLogIn className="w-8 h-8 text-[#1a365d]" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Sign in to Share Feedback</h4>
                  <p className="text-sm text-gray-600">
                    Join our community and share your valuable feedback
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#1a365d] to-[#2c5282] hover:from-[#2c5282] hover:to-[#1a365d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a365d] transition duration-150 ease-in-out"
                  >
                    <FiLogIn className="w-5 h-5" />
                    Sign In
                  </button>
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <span
                      onClick={() => navigate("/signup")}
                      className="font-medium text-[#1a365d] hover:text-[#2c5282] cursor-pointer transition duration-150 ease-in-out"
                    >
                      Create an account
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <>
                <input
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  className="border w-full px-4 py-2 mb-3 rounded-md text-sm focus:ring-2 focus:ring-[#c4a777]"
                  placeholder="Enter your 6-character Complaint ID"
                />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="border w-full px-4 py-2 mb-3 rounded-md text-sm resize-none focus:ring-2 focus:ring-[#c4a777]"
                  placeholder="Share your experience with us..."
                />
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={22}
                      className={`cursor-pointer ${star <= (hoverRating || rating) ? "text-[#c4a777]" : "text-gray-300"}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
                <button
                  onClick={handleAddComment}
                  className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white py-2 px-4 rounded-md w-full hover:from-[#2c5282] hover:to-[#1a365d] transition"
                >
                  Submit Feedback
                </button>
              </>
            )}
          </div>

          {/* Comments Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[#1a365d]">Community Feedback</h3>
              <p className="text-gray-600 italic">"Your voice matters in our journey of continuous improvement"</p>
            </div>
            {comments.length === 0 ? (
              <div className="text-center py-8 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-[#c4a777]/20">
                <FaComment className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No feedback available yet.</p>
                <p className="text-gray-500 text-sm mt-2">Be the first to share your experience</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {paginatedComments.map((com) => (
                  <div key={com._id} className="bg-white/90 backdrop-blur-lg p-4 rounded-3xl shadow-xl border relative border-[#c4a777]/20">
                    <div className="flex items-center mb-2">
                      {com.user?.photo && (
                        <img
                          src={com.user?.photo}
                          alt={com.user.name}
                          className="w-10 h-10 rounded-full mr-3 border border-gray-300"
                        />
                      )}
                      <p className="text-sm text-[#1a365d]">
                        <FaUser className="inline mr-2" /> <strong>{com.user?.name || "Anonymous"}</strong>
                      </p>
                    </div>
                    <p className="text-sm text-[#1a365d] mb-1">
                      <strong>Complaint ID:</strong> {com.complaint?.complaintId}
                    </p>
                    <p className="text-sm text-[#c4a777] font-semibold mb-1">
                      <strong>Rating:</strong> ⭐ {com.rating}
                    </p>
                    <p className="text-[#1a365d] mb-2">{com.text}</p>

                    {com.replies?.length > 0 && (
                      <button onClick={() => toggleReplies(com._id)} className="text-[#2c5282] text-sm mt-2 underline">
                        {showReplies[com._id] ? `Hide Responses (${com.replies.length})` : `View Responses (${com.replies.length})`}
                      </button>
                    )}

                    {showReplies[com._id] && (
                      <div className="mt-3 border-t pt-2 text-sm space-y-2">
                        {com.replies.map((reply) => (
                          <div key={reply._id} className="text-[#1a365d] italic">
                            <p><FaComment className="inline mr-2" /> <strong>Department Response:</strong> {reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {user && com.user && user._id === com.user._id && (
                      <button
                        onClick={() => handleDelete(com._id)}
                        className="absolute top-3 right-3 text-red-600 text-xs hover:underline"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {comments.length > COMMENTS_PER_PAGE && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 text-sm rounded border bg-white hover:bg-gray-100"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => (p + 1) * COMMENTS_PER_PAGE < comments.length ? p + 1 : p)}
                  disabled={(page + 1) * COMMENTS_PER_PAGE >= comments.length}
                  className="px-3 py-1 text-sm rounded border bg-white hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;