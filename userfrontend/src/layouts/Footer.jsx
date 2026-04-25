import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaFacebookF } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 text-white mt-auto">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">SmartBazar</h2>
            <p className="text-sm text-gray-200">
              Your trusted eCommerce platform for modern shopping experience.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-200">
              {["Home", "About", "Contact", "Privacy"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="hover:text-white transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <SocialIcon><FaTwitter /></SocialIcon>
              <SocialIcon><FaYoutube /></SocialIcon>
              <SocialIcon><FaFacebookF /></SocialIcon>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/30 mt-10 pt-6 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} SmartBazar. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

function SocialIcon({ children }) {
  return (
    <div className="w-10 h-10 flex items-center justify-center
      rounded-full bg-white/20 hover:bg-white/30
      hover:scale-110 transition-all cursor-pointer">
      {children}
    </div>
  );
}

export default Footer;