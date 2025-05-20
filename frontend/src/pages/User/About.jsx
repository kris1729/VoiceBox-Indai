import { FiTarget, FiUsers, FiShield, FiGlobe, FiAward, FiHeart } from 'react-icons/fi';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              About VoiceBox India
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Empowering citizens and government departments through innovative complaint management solutions
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-xl border border-[#c4a777]/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <FiTarget className="w-8 h-8 text-[#1a365d]" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-[#1a365d]">Our Vision</h2>
              </div>
              <p className="text-[#2c5282] leading-relaxed">
                To create a transparent and efficient platform that bridges the gap between citizens and government departments, 
                ensuring every voice is heard and every complaint is addressed with utmost priority.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-xl border border-[#c4a777]/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <FiUsers className="w-8 h-8 text-[#1a365d]" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-[#1a365d]">Our Mission</h2>
              </div>
              <p className="text-[#2c5282] leading-relaxed">
                To revolutionize the way citizens interact with government departments by providing a secure, 
                user-friendly platform that streamlines complaint management and enhances service delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center text-[#1a365d] mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#c4a777]/20">
              <div className="bg-slate-50 p-3 rounded-lg w-fit mb-4">
                <FiShield className="w-6 h-6 text-[#1a365d]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">Secure Registration</h3>
              <p className="text-[#2c5282]">
                OTP verification and secure authentication for both citizens and government departments
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#c4a777]/20">
              <div className="bg-slate-50 p-3 rounded-lg w-fit mb-4">
                <FiGlobe className="w-6 h-6 text-[#1a365d]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">Bilingual Support</h3>
              <p className="text-[#2c5282]">
                Seamless experience in both English and Hindi, making it accessible to all citizens
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#c4a777]/20">
              <div className="bg-slate-50 p-3 rounded-lg w-fit mb-4">
                <FiAward className="w-6 h-6 text-[#1a365d]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">AI-Powered Solutions</h3>
              <p className="text-[#2c5282]">
                Intelligent complaint generation and management for efficient resolution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center text-[#1a365d] mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#c4a777]/20">
              <div className="bg-slate-50 p-3 rounded-lg w-fit mb-4">
                <FiHeart className="w-6 h-6 text-[#1a365d]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">Citizen-Centric</h3>
              <p className="text-[#2c5282]">
                Putting citizens first and ensuring their concerns are addressed promptly
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#c4a777]/20">
              <div className="bg-slate-50 p-3 rounded-lg w-fit mb-4">
                <FiShield className="w-6 h-6 text-[#1a365d]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">Transparency</h3>
              <p className="text-[#2c5282]">
                Maintaining clear communication and accountability in all processes
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#c4a777]/20">
              <div className="bg-slate-50 p-3 rounded-lg w-fit mb-4">
                <FiTarget className="w-6 h-6 text-[#1a365d]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">Innovation</h3>
              <p className="text-[#2c5282]">
                Continuously improving our platform with cutting-edge technology
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 