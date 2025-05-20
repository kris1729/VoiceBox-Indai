import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { stateDistrictData } from "../../stateDistrictData.js";
import { FaEye, FaEyeSlash, FaPhone, FaWhatsapp, FaTimes, FaUser, FaEnvelope, FaMapMarkerAlt, FaCamera, FaPlus, FaTrash } from "react-icons/fa";

export default function DepartmentEditProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    state: "",
    district: "",
    workingAreas: [""],
    phone: "",
    whatsapp: "",
    photo: null,
  });
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch current department details on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    axios
      .get("https://voiceboxindia.onrender.com/api/department/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const dept = res.data.data;
        if (dept) {
          setForm({
            name: dept.name || "",
            email: dept.email || "",
            password: "",
            state: dept.state || "",
            district: dept.district || "",
            workingAreas: dept.workingAreas || [""],
            phone: dept.phone || "",
            whatsapp: dept.whatsapp || "",
            photo: null,
          });
          
          // Set districts based on the loaded state
          if (dept.state) {
            setDistricts(stateDistrictData[dept.state] || []);
          }
        } else {
          setError("Failed to load department data");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load department data");
        setLoading(false);
      });
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number validation
    if (name === "phone" || name === "whatsapp") {
      if (value.length <= 10 && /^\d*$/.test(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }

    if (name === "photo") {
      setForm((prev) => ({
        ...prev,
        [name]: e.target.files[0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle state change to load districts
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setForm((prev) => ({
      ...prev,
      state: selectedState,
      district: "", // Reset district on state change
    }));

    // Load the districts for the selected state
    setDistricts(stateDistrictData[selectedState] || []);
  };

  // Handle working area changes
  const handleWorkingAreaChange = (index, value) => {
    const newWorkingAreas = [...form.workingAreas];
    newWorkingAreas[index] = value;
    setForm(prev => ({
      ...prev,
      workingAreas: newWorkingAreas
    }));
  };

  // Add new working area field
  const addWorkingArea = () => {
    setForm(prev => ({
      ...prev,
      workingAreas: [...prev.workingAreas, ""]
    }));
  };

  // Remove working area field
  const removeWorkingArea = (index) => {
    if (form.workingAreas.length > 1) {
      const newWorkingAreas = form.workingAreas.filter((_, i) => i !== index);
      setForm(prev => ({
        ...prev,
        workingAreas: newWorkingAreas
      }));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found at submit, redirecting to login");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.password) formData.append("password", form.password);
      formData.append("state", form.state);
      formData.append("district", form.district);
      // Filter out empty working areas and append each one
      form.workingAreas
        .filter(area => area.trim() !== "")
        .forEach(area => {
          formData.append("workingAreas", area);
        });
      formData.append("phone", form.phone);
      formData.append("whatsapp", form.whatsapp);
      if (form.photo) formData.append("photo", form.photo);

      const res = await axios.put(
        "https://voiceboxindia.onrender.com/api/department/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update response:", res.data);
      alert(res.data.message);
      navigate("/department/profile");
    } catch (err) {
      console.error("Update error:", err.response || err);
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B4242]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-[#1a365d] flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Edit Department Profile</h1>
            <button
              onClick={() => navigate("/department/profile")}
              className="text-white hover:text-[#c4a777] transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-[#1a365d]" />
                    <span>Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-[#1a365d]" />
                    <span>Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-[#1a365d]" />
                    <span>Phone Number</span>
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10 digit number"
                  maxLength="10"
                  className="w-full p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                />
              </div>

              {/* WhatsApp Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaWhatsapp className="text-[#1a365d]" />
                    <span>WhatsApp Number</span>
                  </div>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="10 digit number"
                  maxLength="10"
                  className="w-full p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1a365d] hover:text-[#2c5282]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* State Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#1a365d]" />
                    <span>State</span>
                  </div>
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleStateChange}
                  required
                  className="w-full p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                >
                  <option value="">Select State</option>
                  {Object.keys(stateDistrictData).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#1a365d]" />
                    <span>District</span>
                  </div>
                </label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  required
                  disabled={!form.state}
                  className="w-full p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Working Areas */}
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#1a365d]" />
                    <span>Working Areas</span>
                  </div>
                </label>
                <div className="space-y-3">
                  {form.workingAreas.map((area, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => handleWorkingAreaChange(index, e.target.value)}
                        placeholder={`Working Area ${index + 1}`}
                        className="flex-1 p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                      />
                      {form.workingAreas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWorkingArea(index)}
                          className="p-2 text-[#1a365d] hover:text-[#2c5282] transition-colors"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addWorkingArea}
                    className="flex items-center gap-2 text-[#1a365d] hover:text-[#2c5282] transition-colors"
                  >
                    <FaPlus />
                    <span>Add Another Working Area</span>
                  </button>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-[#1a365d]">
                  <div className="flex items-center gap-2">
                    <FaCamera className="text-[#1a365d]" />
                    <span>Profile Photo</span>
                  </div>
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full p-2 border border-[#c4a777]/30 rounded-lg focus:ring-2 focus:ring-[#c4a777] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/department/profile")}
                className="flex-1 bg-gray-200 text-[#1a365d] py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 bg-[#1a365d] text-white py-2 px-4 rounded-lg hover:bg-[#2c5282] transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
