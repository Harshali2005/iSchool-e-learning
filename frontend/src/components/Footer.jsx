
export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-12">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-gray-300">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-extrabold text-[#38bdf8]">ISchool</h2>
          <p className="text-sm text-gray-400">Learn anytime, anywhere 🌍</p>
        </div>

        <div className="flex gap-6 text-gray-400">
          <a href="#" className="hover:text-[#38bdf8] transition">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="hover:text-[#38bdf8] transition">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="hover:text-[#38bdf8] transition">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="#" className="hover:text-[#38bdf8] transition">
            <i className="fab fa-instagram"></i>
          </a>
        </div>

        <div className="text-center md:text-right text-sm text-gray-400">
          <p>
            📧 <span className="text-[#facc15]">support@ischool.example</span>
          </p>
          <p>📞 +91 98765 43210</p>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-4 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ISchool. All rights reserved.
      </div>
    </footer>
  );
}
