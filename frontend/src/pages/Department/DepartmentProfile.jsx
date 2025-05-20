import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiFileText, FiPrinter, FiX, FiChevronLeft, FiChevronRight, FiMail, FiMapPin, FiPhone, FiMessageSquare, FiEdit2, FiStar, FiClock, FiMessageCircle, FiSend, FiXCircle } from 'react-icons/fi';

export default function DepartmentProfile() {
    const [department, setDepartment] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null); // for modal
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('English');
    const [error, setError] = useState('');
    const [reply, setReply] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

    const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
    const [repliedComments, setRepliedComments] = useState(new Set());
    const [visibleComments, setVisibleComments] = useState(2); // New state for visible comments
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Loading state for show more

    const handleReplyChange = (commentId, text) => {
        setReply((prev) => ({ ...prev, [commentId]: text }));
    };

    const handleReplySubmit = async (commentId) => {
        const token = localStorage.getItem("token");
        if (!token || !reply[commentId]) return;

        try {
            const response = await axios.post(
                `http://localhost:5000/api/comment/reply/${commentId}`,
                { replyText: reply[commentId] },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Reply sent successfully");
                setReply((prev) => ({ ...prev, [commentId]: "" }));
                setActiveReplyCommentId(null);
                fetchData(searchTerm); // Refresh comments
            } else {
                toast.error("Failed to send reply");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send reply");
        }
    };

    // Add pagination states for complaints
    const [complaintsPage, setComplaintsPage] = useState(1);
    const complaintsPerPage = 6;

    const paginatedComplaints = complaints.slice(
        (complaintsPage - 1) * complaintsPerPage,
        complaintsPage * complaintsPerPage
    );

    // Handler to toggle reply input box for a comment
    const toggleReplyBox = (commentId) => {
        setActiveReplyCommentId((prev) => (prev === commentId ? null : commentId));
    };

    // Handler for Previous complaints page button
    const prevComplaintsPage = () => {
        if (complaintsPage > 1) setComplaintsPage(complaintsPage - 1);
    };

    // Handler for Next complaints page button
    const nextComplaintsPage = () => {
        if (complaintsPage * complaintsPerPage < complaints.length)
            setComplaintsPage(complaintsPage + 1);
    };

    const fetchData = useCallback(async (search = '') => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/department/login');
            return;
        }

        try {
            const res = await axios.get('http://localhost:5000/api/department/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDepartment(res.data.data);

            const url = search.trim()
                ? `http://localhost:5000/api/complaint/department?search=${encodeURIComponent(search.trim())}`
                : 'http://localhost:5000/api/complaint/department';

            const complaintsRes = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const complaintData = complaintsRes.data.data;
            setComplaints(complaintData);

            const departmentId = res.data.data._id;
            const allCommentsRes = await axios.get(`http://localhost:5000/api/comment/${departmentId}`);
            setComments(allCommentsRes.data.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load department data.');
            navigate('/department/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Debounce search input
    useEffect(() => {
        fetchData(); // initial fetch
    }, [fetchData]);

    // Function to handle loading more comments
    const handleShowMore = () => {
        setIsLoadingMore(true);
        // Simulate loading delay for smooth transition
        setTimeout(() => {
            setVisibleComments(prev => prev + 2);
            setIsLoadingMore(false);
        }, 500);
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
            {/* Hero Section with Department Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Department Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 transform transition-all duration-300 hover:shadow-2xl border border-[#c4a777]/20">
                    <div className="flex flex-col lg:flex-row gap-8">
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

                            <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-[#c4a777]/20">
                                <div className="flex items-center justify-center space-x-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, index) => (
                                            <FiStar
                                                key={index}
                                                className={`w-6 h-6 transform transition-transform duration-300 hover:scale-110 ${
                                                    index < department?.averageRating ? "text-[#c4a777]" : "text-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg font-semibold text-[#1a365d]">
                                        {department?.averageRating?.toFixed(1) || "0.0"}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-[#1a365d] tracking-tight mb-2">
                                        {department?.name}
                                    </h1>
                                    <p className="text-[#2c5282] italic">"Serving with Excellence, Building Trust"</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Department Details */}
                        <div className="lg:w-2/3 space-y-6">
                            {/* Contact Information Card */}
                            <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-[#c4a777]/20">
                                <h2 className="text-xl font-semibold text-[#1a365d] mb-6 flex items-center border-b border-[#c4a777]/20 pb-3">
                                    <FiMail className="h-6 w-6 mr-2" />
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { 
                                            label: 'Email Address', 
                                            value: department?.email, 
                                            icon: <FiMail className="h-5 w-5 text-[#1a365d]" />,
                                            description: 'Primary contact email'
                                        },
                                        { 
                                            label: 'Phone Number', 
                                            value: department?.phone || 'Not Available', 
                                            icon: <FiPhone className="h-5 w-5 text-[#1a365d]" />,
                                            description: 'Office contact number'
                                        },
                                        { 
                                            label: 'WhatsApp', 
                                            value: department?.whatsapp || 'Not Available', 
                                            icon: <FiMessageSquare className="h-5 w-5 text-[#1a365d]" />,
                                            description: 'WhatsApp business number'
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#c4a777]/20">
                                            <div className="flex items-start space-x-3">
                                                <div className="p-2 bg-[#1a365d] bg-opacity-10 rounded-lg flex-shrink-0">
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-[#1a365d]">{item.label}</h3>
                                                    <p className="text-[#2c5282] mt-1 break-all overflow-hidden text-ellipsis">
                                                        {item.value}
                                                    </p>
                                                    <p className="text-sm text-[#2c5282]/70 mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Location Information Card */}
                            <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-[#c4a777]/20">
                                <h2 className="text-xl font-semibold text-[#1a365d] mb-6 flex items-center border-b border-[#c4a777]/20 pb-3">
                                    <FiMapPin className="h-6 w-6 mr-2" />
                                    Location Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { 
                                            label: 'State', 
                                            value: department?.state, 
                                            icon: <FiMapPin className="h-5 w-5 text-[#1a365d]" />,
                                            description: 'Operating state'
                                        },
                                        { 
                                            label: 'District', 
                                            value: department?.district, 
                                            icon: <FiMapPin className="h-5 w-5 text-[#1a365d]" />,
                                            description: 'Operating district'
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#c4a777]/20">
                                            <div className="flex items-start space-x-3">
                                                <div className="p-2 bg-[#1a365d] bg-opacity-10 rounded-lg flex-shrink-0">
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-[#1a365d]">{item.label}</h3>
                                                    <p className="text-[#2c5282] mt-1 break-all overflow-hidden text-ellipsis">
                                                        {item.value}
                                                    </p>
                                                    <p className="text-sm text-[#2c5282]/70 mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Service Areas Card */}
                            <div className="bg-slate-50 rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-[#1a365d] mb-6 flex items-center border-b border-[#c4a777]/20 pb-3">
                                    <FiMapPin className="h-6 w-6 mr-2" />
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

                            {/* Update Profile Button */}
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => window.location.href = "/department/edit-profile"}
                                    className="bg-[#1a365d] hover:bg-[#2c5282] text-white px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
                                >
                                    <FiEdit2 className="h-5 w-5" />
                                    <span>Update Department Profile</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiFileText className="h-5 w-5 text-gray-400 group-focus-within:text-[#1a365d] transition-colors duration-300" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search grievances by ID, problem, or location..."
                            className="w-full pl-12 pr-32 py-4 rounded-xl border-2 border-gray-200 focus:border-[#1a365d] focus:ring-2 focus:ring-[#1a365d] focus:ring-opacity-50 transition-all duration-300 outline-none text-gray-700 placeholder-gray-400 shadow-sm bg-white"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <button
                                onClick={() => fetchData(searchTerm)}
                                className="bg-[#1a365d] text-white px-6 py-2 rounded-lg hover:bg-[#2c5282] transition-all duration-300 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                        Enter grievance ID, problem description, or location to find specific records
                    </p>
                </div>

                {/* Complaints Section */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-[#1a365d] mb-6 flex items-center">
                        <FiFileText className="w-7 h-7 mr-2" />
                        Your Complaints
                    </h2>

                    {complaints.length === 0 ? (
                        <div className="text-center py-10">
                            <FiFileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500 text-lg">No complaints found at the moment.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {paginatedComplaints.map((c) => (
                                    <div
                                        key={c._id}
                                        className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-[#1a365d]">
                                                    ID: {c.complaintId}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                    c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {c.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <p className="flex items-center text-[#2c5282]">
                                                    <span className="font-medium mr-2">Department:</span>
                                                    {c.department?.name}
                                                </p>
                                                <p className="flex items-center text-[#2c5282]">
                                                    <span className="font-medium mr-2">Problem:</span>
                                                    {c.problem}
                                                </p>
                                                <p className="flex items-center text-[#2c5282]">
                                                    <span className="font-medium mr-2">Address:</span>
                                                    {c.address}
                                                </p>
                                                <p className="flex items-center text-[#2c5282]">
                                                    <span className="font-medium mr-2">Phone:</span>
                                                    {c.phone}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedApp(c.englishApplication);
                                                        setLanguage('English');
                                                    }}
                                                    className="flex-1 bg-white border border-[#c4a777] text-[#c4a777] px-4 py-2 rounded-lg hover:bg-[#c4a777] transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                                >
                                                    <FiFileText className="w-4 h-4" />
                                                    <span>English</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedApp(c.hindiApplication);
                                                        setLanguage('Hindi');
                                                    }}
                                                    className="flex-1 bg-white border border-[#c4a777] text-[#c4a777] px-4 py-2 rounded-lg hover:bg-[#c4a777] transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                                >
                                                    <FiFileText className="w-4 h-4" />
                                                    <span>Hindi</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-8 flex justify-center space-x-4">
                                <button
                                    onClick={prevComplaintsPage}
                                    disabled={complaintsPage === 1}
                                    className={`px-6 py-2 rounded-lg border-2 flex items-center space-x-2 ${
                                        complaintsPage === 1
                                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'border-[#c4a777] text-[#c4a777] hover:bg-[#c4a777] hover:text-white transition-colors duration-300'
                                    }`}
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                    <span>Previous</span>
                                </button>
                                <button
                                    onClick={nextComplaintsPage}
                                    disabled={complaintsPage * complaintsPerPage >= complaints.length}
                                    className={`px-6 py-2 rounded-lg border-2 flex items-center space-x-2 ${
                                        complaintsPage * complaintsPerPage >= complaints.length
                                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'border-[#c4a777] text-[#c4a777] hover:bg-[#c4a777] hover:text-white transition-colors duration-300'
                                    }`}
                                >
                                    <span>Next</span>
                                    <FiChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Comments Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[#1a365d] mb-3 flex items-center justify-center">
                                <FiMessageCircle className="h-8 w-8 mr-2" />
                                Customer Feedback
                            </h2>
                            <p className="text-[#2c5282] italic">"Your feedback helps us improve our services"</p>
                        </div>

                        {comments.length > 0 ? (
                            <>
                                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scroll-smooth">
                                    {comments.slice(0, visibleComments).map((com) => (
                                        <div
                                            key={com._id}
                                            className="bg-slate-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a365d] to-[#2c5282] flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                            {com.user?.name?.charAt(0) || "A"}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-[#1a365d] text-lg">
                                                                {com.user?.name || "Anonymous User"}
                                                            </p>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-gray-500">
                                                                    Grievance ID: {com.complaint?.complaintId}
                                                                </span>
                                                                <span className="text-gray-300">•</span>
                                                                <span className="text-sm text-gray-500 flex items-center">
                                                                    <FiClock className="w-3 h-3 mr-1" />
                                                                    {new Date(com.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                                                        <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                                                        <span className="font-medium text-yellow-700">{com.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                    <p className="text-gray-700 leading-relaxed">{com.text}</p>
                                                </div>

                                                {/* Replies */}
                                                {com.replies && com.replies.length > 0 && (
                                                    <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-100">
                                                        <h4 className="text-sm font-semibold text-gray-600 flex items-center">
                                                            <FiMessageCircle className="h-4 w-4 mr-1" />
                                                            Department Responses
                                                        </h4>
                                                        {com.replies.map((reply) => (
                                                            <div key={reply._id} className="border-l-4 border-green-500 pl-4 py-2">
                                                                <p className="text-gray-700 text-sm">{reply.text}</p>
                                                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                                    <FiClock className="w-3 h-3 mr-1" />
                                                                    {new Date(reply.createdAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Reply Input */}
                                                {activeReplyCommentId === com._id ? (
                                                    <div className="space-y-3">
                                                        <textarea
                                                            value={reply[com._id] || ""}
                                                            onChange={(e) => handleReplyChange(com._id, e.target.value)}
                                                            className="w-full rounded-lg border-gray-200 focus:border-[#c4a777] focus:ring-2 focus:ring-[#c4a777] focus:ring-opacity-50 transition-all duration-300"
                                                            placeholder="Type your response here..."
                                                            rows="3"
                                                        />
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => toggleReplyBox(com._id)}
                                                                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                                            >
                                                                <FiXCircle className="h-4 w-4" />
                                                                <span>Cancel</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReplySubmit(com._id)}
                                                                className="px-4 py-2 bg-[#c4a777] text-white rounded-lg hover:bg-[#2c5282] transition-colors duration-300 flex items-center space-x-1"
                                                            >
                                                                <FiSend className="h-4 w-4" />
                                                                <span>Send Response</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleReplyBox(com._id)}
                                                        className="text-[#c4a777] hover:text-[#2c5282] font-medium transition-colors duration-300 flex items-center space-x-2 bg-white border border-[#c4a777] px-4 py-2 rounded-lg hover:bg-[#c4a777] hover:text-white"
                                                    >
                                                        <FiMessageCircle className="h-5 w-5" />
                                                        <span>Respond to Feedback</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Show More Button */}
                                {visibleComments < comments.length && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={handleShowMore}
                                            disabled={isLoadingMore}
                                            className="inline-flex items-center px-6 py-3 bg-[#c4a777] text-white rounded-lg hover:bg-[#2c5282] transition-colors duration-300 disabled:opacity-50"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    Load More Feedback
                                                    <FiChevronRight className="h-5 w-5 ml-2" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-10">
                                <FiMessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 text-lg">No feedback available</p>
                                <p className="text-gray-400 text-sm mt-2">Be the first to share your experience</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        id="print-area"
                        className="bg-white w-full max-w-[95vw] h-auto sm:w-[29.7cm] sm:h-[21cm] p-4 sm:p-8 rounded-xl shadow-2xl overflow-auto flex flex-col"
                        style={{ fontFamily: 'serif' }}
                    >
                        <div className="sticky top-0 bg-white z-10 border-b pb-4 mb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <FiFileText className="w-6 h-6 text-[#1a365d]" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#1a365d]">
                                        {language} Grievance Application
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="whitespace-pre-wrap text-[14px] sm:text-[15px] leading-6 sm:leading-7 text-gray-700 tracking-wide bg-gray-50 p-4 sm:p-6 rounded-lg flex-grow">
                            {selectedApp}
                        </div>

                        <div className="sticky bottom-0 bg-white z-10 border-t pt-4 mt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => {
                                    const originalContents = document.body.innerHTML;
                                    const printContents = document.getElementById('print-area').innerHTML;
                                    document.body.innerHTML = printContents;
                                    window.print();
                                    document.body.innerHTML = originalContents;
                                    window.location.reload();
                                }}
                                className="flex bg-white border border-[#c4a777] text-[#c4a777] px-6 py-2.5 rounded-lg hover:bg-[#c4a777] hover:text-white transition-all duration-300 items-center justify-center gap-2 shadow-sm hover:shadow-md font-medium"
                            >
                                <FiPrinter className="w-4 h-4" />
                                <span className="sm:hidden">Print</span>
                                <span className="hidden sm:inline">Print Document</span>
                            </button>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="flex bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-300 items-center justify-center gap-2 shadow-sm hover:shadow-md font-medium"
                            >
                                <FiX className="w-4 h-4" />
                                <span className="sm:hidden">Close</span>
                                <span className="hidden sm:inline">Close Document</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-center" />
        </main>
  );
}
