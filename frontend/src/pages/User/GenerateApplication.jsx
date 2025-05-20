import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  AiOutlineLoading3Quarters, 
  AiOutlineFileText, 
  AiOutlinePhone, 
  AiOutlineHome,
  AiOutlinePicture,
  AiOutlineCheckCircle,
  AiOutlineArrowLeft,
  AiOutlineSend,
  AiOutlineReload
} from "react-icons/ai";

const GenerateApplication = () => {
  const { id: departmentId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [englishApp, setEnglishApp] = useState("");
  const [hindiApp, setHindiApp] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const token = localStorage.getItem("token");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGenerated(false);

    try {
      const res = await axios.post(
        "https://voiceboxindia.onrender.com/api/complaint/generate-application",
        {
          selectedDepartmentId: departmentId,
          problem,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.data;
      setEnglishApp(data.englishApplication);
      setHindiApp(data.hindiApplication);
      setGenerated(true);
      toast.success("Application generated successfully!");
    } catch (err) {
      toast.error("Failed to generate application. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendComplaint = async () => {
    try {
      await axios.post(
        "https://voiceboxindia.onrender.com/api/complaint/send-complaint",
        {
          departmentId,
          problem,
          phone,
          address,
          englishApplication: englishApp,
          hindiApplication: hindiApp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Your complaint was registered. Check your email.");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      toast.error("Error sending complaint. Please try again.");
    }
  };

  const handleRegenerate = () => {
    setGenerated(false);
    setEnglishApp("");
    setHindiApp("");
    toast.info("You can now regenerate the application.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-8 border border-[#c4a777]/20">
          <ToastContainer position="top-center" autoClose={3000} />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a365d] flex items-center gap-2">
                <AiOutlineFileText className="w-8 h-8 text-[#c4a777]" />
                Raise a Complaint
              </h1>
              <p className="text-[#2c5282] mt-2">Fill in the details below to generate your application</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-[#1a365d] bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 border border-[#c4a777]/30"
            >
              <AiOutlineArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="problem" className="block text-sm font-medium text-[#1a365d] flex items-center gap-2">
                <AiOutlineFileText className="w-4 h-4 text-[#c4a777]" />
                Describe your problem
              </label>
              <textarea
                id="problem"
                placeholder="Please provide detailed information about your issue..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
                className="w-full min-h-[120px] border border-[#c4a777]/30 rounded-xl p-3 text-sm sm:text-base focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200 bg-slate-50"
                rows={4}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-[#1a365d] flex items-center gap-2">
                  <AiOutlinePhone className="w-4 h-4 text-[#c4a777]" />
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter your contact number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full border border-[#c4a777]/30 rounded-xl p-3 text-sm sm:text-base focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200 bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-[#1a365d] flex items-center gap-2">
                  <AiOutlineHome className="w-4 h-4 text-[#c4a777]" />
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full border border-[#c4a777]/30 rounded-xl p-3 text-sm sm:text-base focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200 bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a365d] hover:bg-[#2c5282] text-white py-3 px-6 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
              {loading ? "Generating Application..." : "Generate Application"}
            </button>
          </form>

          {generated && (
            <div className="space-y-8 mt-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-[#c4a777]/20">
                <h3 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2">
                  <AiOutlineCheckCircle className="w-5 h-5 text-[#c4a777]" />
                  Application Generated Successfully
                </h3>
                <p className="text-[#2c5282] mt-2">Please review the generated applications below and make any necessary adjustments.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#c4a777] rounded-full"></span>
                    English Application
                  </h3>
                  <textarea
                    value={englishApp}
                    onChange={(e) => setEnglishApp(e.target.value)}
                    rows={8}
                    className="w-full border border-[#c4a777]/30 rounded-xl p-4 font-mono text-sm bg-slate-50 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200"
                  ></textarea>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#c4a777] rounded-full"></span>
                    Hindi Application
                  </h3>
                  <textarea
                    value={hindiApp}
                    onChange={(e) => setHindiApp(e.target.value)}
                    rows={8}
                    className="w-full border border-[#c4a777]/30 rounded-xl p-4 font-mono text-sm bg-slate-50 focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all duration-200"
                  ></textarea>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-[#1a365d] flex items-center gap-2">
                    <AiOutlinePicture className="w-4 h-4 text-[#c4a777]" />
                    Supporting Document (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer bg-slate-50 border border-[#c4a777]/30 rounded-xl px-4 py-2 text-sm text-[#1a365d] hover:bg-slate-100 transition-colors flex items-center gap-2"
                    >
                      <AiOutlinePicture className="w-4 h-4" />
                      Choose Photo
                    </label>
                    {photoPreview && (
                      <div className="relative w-20 h-20">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setPhoto(null);
                            setPhotoPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <h4 className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                    <AiOutlineCheckCircle className="w-4 h-4" />
                    Important: Please Verify
                  </h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• All personal details are correct</li>
                    <li>• Problem description is accurate</li>
                    <li>• Contact information is up to date</li>
                    <li>• Both English and Hindi applications are reviewed</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleSendComplaint}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <AiOutlineSend className="w-4 h-4" />
                    Submit Complaint
                  </button>
                  <button
                    onClick={handleRegenerate}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium flex items-center justify-center gap-2"
                  >
                    <AiOutlineReload className="w-4 h-4" />
                    Regenerate Application
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateApplication;
