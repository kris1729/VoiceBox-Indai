import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiLogOut, FiUser, FiLogIn, FiMenu, FiX, FiHome, FiInfo, FiMail, FiShield } from 'react-icons/fi';

export default function DepartmentNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const DepartmentToken = localStorage.getItem('token');
    
    if (DepartmentToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/department/login');
  };

  return (
    <nav className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link
            to="/department"
            className="flex items-center space-x-2 text-2xl font-serif font-semibold hover:text-[#c4a777] transition duration-300"
          >
            <FiHome className="w-8 h-8" />
            <span className="hidden sm:inline">VoiceBox Department</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white hover:text-[#c4a777] focus:outline-none transition duration-300"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX className="w-8 h-8" /> : <FiMenu className="w-8 h-8" />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/department/about" className="flex items-center space-x-1 hover:bg-[#2c5282] hover:text-[#c4a777] rounded-xl px-4 py-2 transition duration-300">
              <FiInfo className="w-5 h-5" />
              <span>About Us</span>
            </Link>
            <Link to="/department/contact" className="flex items-center space-x-1 hover:bg-[#2c5282] hover:text-[#c4a777] rounded-xl px-4 py-2 transition duration-300">
              <FiMail className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>
            <Link to="/department/privacy" className="flex items-center space-x-1 hover:bg-[#2c5282] hover:text-[#c4a777] rounded-xl px-4 py-2 transition duration-300">
              <FiShield className="w-5 h-5" />
              <span>Privacy</span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/department/profile"
                  className="flex items-center space-x-2 bg-[#c4a777] text-white px-4 py-2 rounded-xl font-medium transition duration-300 hover:bg-[#b38d5f]"
                >
                  <FiUser className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-[#1a365d] text-white px-4 py-2 rounded-xl font-medium transition duration-300 hover:bg-[#2c5282] border border-[#c4a777]/30"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/department/login"
                className="flex items-center space-x-2 bg-[#c4a777] text-white px-4 py-2 rounded-xl font-medium transition duration-300 hover:bg-[#b38d5f]"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}

            {!isLoggedIn && (
              <Link
                to="/"
                className="flex items-center space-x-2 bg-[#1a365d] text-white px-4 py-2 rounded-xl font-medium transition duration-300 hover:bg-[#2c5282] border border-[#c4a777]/30"
              >
                <FiHome className="w-5 h-5" />
                <span>User Area</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a365d] text-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/department/about" className="flex items-center space-x-2 hover:bg-[#2c5282] hover:text-[#c4a777] rounded-xl px-4 py-2 transition duration-300">
              <FiInfo className="w-5 h-5" />
              <span>About Us</span>
            </Link>
            <Link to="/department/contact" className="flex items-center space-x-2 hover:bg-[#2c5282] hover:text-[#c4a777] rounded-xl px-4 py-2 transition duration-300">
              <FiMail className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>
            <Link to="/department/privacy" className="flex items-center space-x-2 hover:bg-[#2c5282] hover:text-[#c4a777] rounded-xl px-4 py-2 transition duration-300">
              <FiShield className="w-5 h-5" />
              <span>Privacy</span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/department/profile"
                  className="flex items-center space-x-2 bg-[#c4a777] text-white px-4 py-2 rounded-xl font-medium transition duration-300 hover:bg-[#b38d5f]"
                >
                  <FiUser className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 bg-[#1a365d] text-white px-4 py-2 rounded-xl font-medium transition duration-300 hover:bg-[#2c5282] border border-[#c4a777]/30"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/department/login"
                className="flex items-center space-x-2 bg-[#c4a777] text-white px-4 py-2 rounded-xl font-medium transition duration-300 hover:bg-[#b38d5f]"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}

            {!isLoggedIn && (
              <Link
                to="/"
                className="flex items-center space-x-2 bg-[#1a365d] text-white px-4 py-2 rounded-xl font-medium transition duration-300 hover:bg-[#2c5282] border border-[#c4a777]/30"
              >
                <FiHome className="w-5 h-5" />
                <span>User Area</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
