export default function Footer() {
  return (
    <footer>     {/* Footer Section */}
      <div className="bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white py-12 sm:py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Join Us in Building a Better India</h3>
          <p className="text-lg sm:text-xl font-light mb-6 sm:mb-8">
            "Your voice matters. Together, let's build a better India."
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="text-[#c4a777] py-4 text-center mt-auto">
              <p>© 2025 VoiceBox India. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
