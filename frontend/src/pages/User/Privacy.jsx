import { FiShield, FiLock, FiUser, FiDatabase, FiAlertCircle } from 'react-icons/fi';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your privacy and data security are our top priorities
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 shadow-xl border border-[#c4a777]/20">
            <div className="space-y-8">
              {/* Information Collection */}
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <FiUser className="w-6 h-6 text-[#1a365d]" />
                  </div>
                  <h2 className="text-2xl font-serif font-semibold text-[#1a365d]">Information Collection</h2>
                </div>
                <div className="text-[#2c5282] space-y-4">
                  <p>
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name and contact information</li>
                    <li>Government identification details</li>
                    <li>Complaint-related information</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
              </div>

              {/* Data Protection */}
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <FiLock className="w-6 h-6 text-[#1a365d]" />
                  </div>
                  <h2 className="text-2xl font-serif font-semibold text-[#1a365d]">Data Protection</h2>
                </div>
                <div className="text-[#2c5282] space-y-4">
                  <p>
                    We implement robust security measures to protect your data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>End-to-end encryption for all communications</li>
                    <li>Secure data storage with regular backups</li>
                    <li>Access controls and authentication</li>
                    <li>Regular security audits and updates</li>
                  </ul>
                </div>
              </div>

              {/* Information Usage */}
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <FiDatabase className="w-6 h-6 text-[#1a365d]" />
                  </div>
                  <h2 className="text-2xl font-serif font-semibold text-[#1a365d]">Information Usage</h2>
                </div>
                <div className="text-[#2c5282] space-y-4">
                  <p>
                    Your information is used to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Process and track your complaints</li>
                    <li>Communicate with you about your cases</li>
                    <li>Improve our services and user experience</li>
                    <li>Comply with legal requirements</li>
                  </ul>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-lg">
                    <FiAlertCircle className="w-6 h-6 text-[#1a365d]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a365d] mb-2">Important Notice</h3>
                    <p className="text-[#2c5282]">
                      By using VoiceBox India, you consent to our privacy policy. We may update this policy periodically, 
                      and we will notify you of any significant changes. For any privacy-related concerns, 
                      please contact our data protection officer at privacy@voiceboxindia.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 