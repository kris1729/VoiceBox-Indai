import { useState } from 'react';
import axios from 'axios';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://voiceboxindia.onrender.com/api/contact', formData);
      if (res.status === 200) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setStatus('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 flex flex-col">
      <main className="flex-grow flex justify-center items-center p-6">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl p-8 shadow-xl border border-[#c4a777]/20">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-[#1a365d]">Get in Touch</h2>
            <p className="text-[#2c5282] mb-8">
              VoiceBox India is your trusted partner in government complaint management. We're here to help you with any questions about our services, technical support, or general inquiries.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <FiMail className="w-6 h-6 text-[#1a365d]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1a365d]">Email Us</h3>
                  <a href="mailto:voiceboxindia.24x7@gmail.com" className="text-[#2c5282] hover:text-[#1a365d] transition-colors">
                   voiceboxindia.24x7@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <FiPhone className="w-6 h-6 text-[#1a365d]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1a365d]">Call Us</h3>
                  <p className="text-[#2c5282]">24/7 Customer Support</p>
                  <p className="text-[#2c5282]">+91 1800-XXX-XXXX</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <FiMapPin className="w-6 h-6 text-[#1a365d]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1a365d]">Visit Us</h3>
                  <p className="text-[#2c5282]">VoiceBox India Headquarters<br />Bangalore, Karnataka, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-xl border border-[#c4a777]/20">
            <h1 className="text-2xl font-serif font-semibold mb-6 border-b border-[#c4a777]/20 pb-4 text-[#1a365d]">
              Send us a Message
            </h1>

            <div className="space-y-6">
              <label className="block">
                <span className="block font-medium mb-2 text-[#1a365d]">Name</span>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-[#c4a777]/30 p-3 pl-4 text-[#1a365d] 
                      focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent
                      transition duration-200 placeholder-[#2c5282]/50"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="block font-medium mb-2 text-[#1a365d]">Email</span>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full rounded-xl border border-[#c4a777]/30 p-3 pl-4 text-[#1a365d] 
                      focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent
                      transition duration-200 placeholder-[#2c5282]/50"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="block font-medium mb-2 text-[#1a365d]">Message</span>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full rounded-xl border border-[#c4a777]/30 p-3 pl-4 text-[#1a365d] 
                      focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:border-transparent
                      transition duration-200 placeholder-[#2c5282]/50 resize-none"
                    required
                  />
                </div>
              </label>

              <button
                type="submit"
                className="w-full bg-[#1a365d] text-white font-medium py-3 px-4 rounded-xl
                  hover:bg-[#2c5282] focus:outline-none focus:ring-2 focus:ring-[#c4a777] focus:ring-offset-2
                  transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                  flex items-center justify-center space-x-2"
              >
                <FiSend className="w-5 h-5" />
                <span>Send Message</span>
              </button>

              {status && (
                <p className={`text-center mt-4 ${
                  status.includes('successfully') ? 'text-[#2c5282]' : 'text-rose-600'
                }`}>
                  {status}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
