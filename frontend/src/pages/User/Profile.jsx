import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPhone , FiUser, FiMail, FiMapPin, FiEdit2, FiTrash2, FiFileText, FiPrinter, FiX, FiAlertCircle, FiBarChart2, FiList} from 'react-icons/fi';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null); // for modal
    const [language, setLanguage] = useState(''); // english/hindi
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const fetchData = async () => {
            try {
                const [userRes, complaintRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/user/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:5000/api/complaint/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setUser(userRes.data.data || null);
                setComplaints(complaintRes.data.data || []);
            } catch (err) {
                setError('Failed to load data. Please log in again.');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);


    const deleteComplaint = async (complaintId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.delete(`http://localhost:5000/api/complaint/delete/${complaintId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.message === 'Complaint deleted successfully.') {
                setComplaints(complaints.filter((c) => c.complaintId !== complaintId));
                alert('Complaint deleted successfully.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete complaint. Please try again.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 via-white to-slate-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1a365d]"></div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 via-white to-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-xl text-red-600">{error}</p>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* User Info Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-[#c4a777]/20">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* User Photo Section */}
                        <div className="w-full md:w-1/3">
                            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border-2 border-[#1a365d] shadow-lg">
                                {user.photo ? (
                                    <img 
                                        src={user.photo} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#1a365d] to-[#2c5282] flex items-center justify-center text-6xl text-white font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h1 className="text-xl font-bold text-white">
                                        {user.name}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* User Details Section */}
                        <div className="w-full md:w-2/3">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#1a365d] flex items-center gap-2">
                                    <FiUser className="w-6 h-6" />
                                    Personal Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiMail className="w-5 h-5 text-[#1a365d]" />
                                        <span className="font-semibold text-[#1a365d]">Email Address</span>
                                    </div>
                                    <p className="text-[#2c5282] break-all pl-8">{user.email}</p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiBarChart2 className="w-5 h-5 text-[#1a365d]" />
                                        <span className="font-semibold text-[#1a365d]">Complaint Statistics</span>
                                    </div>
                                    <div className="flex items-center gap-2 pl-8">
                                        <FiList className="w-4 h-4 text-[#1a365d]" />
                                        <p className="text-[#2c5282]">{complaints.length} Grievances Filed</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Information - Right Side */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiMapPin className="w-5 h-5 text-[#1a365d]" />
                                        <span className="font-semibold text-[#1a365d]">State</span>
                                    </div>
                                    <p className="text-[#2c5282] pl-8">{user.state}</p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiMapPin className="w-5 h-5 text-[#1a365d]" />
                                        <span className="font-semibold text-[#1a365d]">District</span>
                                    </div>
                                    <p className="text-[#2c5282] pl-8">{user.district}</p>
                                </div>
                            </div>

                            <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <FiAlertCircle className="w-5 h-5 text-[#1a365d]" />
                                    <span className="font-semibold text-[#1a365d]">Quick Actions</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white px-4 py-2 rounded-lg hover:from-[#2c5282] hover:to-[#1a365d] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        <FiFileText className="w-4 h-4" />
                                        File New Grievance
                                    </button>
                                    <button
                                        onClick={() => navigate('/edit-profile')}
                                        className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white px-4 py-2 rounded-lg hover:from-[#2c5282] hover:to-[#1a365d] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaints Card */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-[#c4a777]/20">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#1a365d] flex items-center gap-2">
                            <FiFileText className="w-6 h-6" />
                            Grievance History
                        </h2>
                        <div className="flex items-center gap-2 bg-[#1a365d] text-white px-4 py-2 rounded-full text-sm">
                            <FiBarChart2 className="w-4 h-4" />
                            <span>{complaints.length} Total Grievances</span>
                        </div>
                    </div>

                    {complaints.length === 0 ? (
                        <div className="text-center py-12">
                            <FiFileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No grievances have been filed yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {complaints.map((c) => (
                                <div key={c._id} className="bg-slate-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[#c4a777]/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-[#1a365d]">
                                            Grievance ID - {c.complaintId}
                                        </h3>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <p className="flex items-center gap-2">
                                            <FiFileText className="w-4 h-4 text-[#1a365d]" />
                                            <span className="font-semibold">Department:</span>
                                            <span className="text-[#2c5282]">{c.department?.name}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FiAlertCircle className="w-4 h-4 text-[#1a365d]" />
                                            <span className="font-semibold">Issue:</span>
                                            <span className="text-[#2c5282]">{c.problem}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FiMapPin className="w-4 h-4 text-[#1a365d]" />
                                            <span className="font-semibold">Location:</span>
                                            <span className="text-[#2c5282]">{c.address}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FiPhone className="w-4 h-4 text-[#1a365d]" />
                                            <span className="font-semibold">Contact:</span>
                                            <span className="text-[#2c5282]">{c.phone}</span>
                                        </p>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => deleteComplaint(c.complaintId)}
                                            className="flex-1 bg-white border border-red-200 text-red-600 px-4 py-2.5 text-sm rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md font-medium"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedApp(c.englishApplication);
                                                setLanguage('English');
                                            }}
                                            className="flex-1 bg-white border border-[#1a365d] text-[#1a365d] px-4 py-2.5 text-sm rounded-lg hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md font-medium"
                                        >
                                            <FiFileText className="w-4 h-4" />
                                            English
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedApp(c.hindiApplication);
                                                setLanguage('Hindi');
                                            }}
                                            className="flex-1 bg-white border border-green-200 text-green-600 px-4 py-2.5 text-sm rounded-lg hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md font-medium"
                                        >
                                            <FiFileText className="w-4 h-4" />
                                            Hindi
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Application Modal - Enhanced for Mobile First */}
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
                                className="flex bg-white border border-[#1a365d] text-[#1a365d] px-6 py-2.5 rounded-lg hover:bg-[#1a365d] hover:text-white transition-all duration-300 items-center justify-center gap-2 shadow-sm hover:shadow-md font-medium"
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
        </main>
    );
}
