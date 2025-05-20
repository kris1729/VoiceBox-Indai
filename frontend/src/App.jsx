import { Routes, Route } from 'react-router-dom';
import UserLayout from './components/Layout.jsx';
import DepartmentLayout from './components/DepartmentLayout.jsx';

import GenerateApplication from "./pages/User/GenerateApplication.jsx";
import Home from './pages/User/Home.jsx';
import About from './pages/User/About.jsx';
import Contact from './pages/User/Contact.jsx';
import Privacy from './pages/User/Privacy.jsx';
import LoginUser from './pages/User/LoginUser.jsx';
import SignupUser from './pages/User/SignupUser.jsx';
import VerifyOtp from './pages/User/VerifyOtp.jsx';
import Profile from './pages/User/Profile.jsx';
import EditProfile from './pages/User/EditProfile.jsx';
import ReviewPage from "./pages/User/ReviewPage.jsx";

import DepartmentDashboard from './pages/Department/Dashboard.jsx';
import DepartmentProfile from './pages/Department/DepartmentProfile.jsx';
import DepartmentEditProfile from './pages/Department/DepartmentEditProfile.jsx';
import DepartmentLogin from './pages/Department/DepartmentSignin.jsx';
import DepartmentSignup from './pages/Department/DepartmentSignup.jsx';
import DepartmentVerifyOTP from './pages/Department/DepartmentVerifyOTP.jsx';

function App() {
  return (
    <>
      {/* User Routes */}
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="login" element={<LoginUser />} />
          <Route path="signup" element={<SignupUser />} />
          <Route path="verify-otp" element={<VerifyOtp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="complaint/raise/:id" element={<GenerateApplication />} />
          <Route path="review/:id" element={<ReviewPage />} />
        </Route>

        {/* Department Routes  */}
        <Route path="/department" element={<DepartmentLayout />}>
          <Route index element={<DepartmentDashboard />} />
          <Route path="login" element={<DepartmentLogin />} />
          <Route path="signup" element={<DepartmentSignup />} />
          <Route path="verify-otp" element={<DepartmentVerifyOTP />} />
          <Route path="profile" element={<DepartmentProfile />} />
           <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="edit-profile" element={<DepartmentEditProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
