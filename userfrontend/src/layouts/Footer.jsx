import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaFacebookF } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white mt-auto">

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-wide">
              SmartBazar
            </h2>
            <p className="text-sm text-gray-200 leading-relaxed">
              Providing reliable tech solutions since 2026.
              Secure, scalable and modern.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="font-semibold text-lg">Follow Us</h3>

            <div className="flex justify-center sm:justify-start gap-4">
              <SocialIcon>
                <FaTwitter />
              </SocialIcon>
              <SocialIcon>
                <FaYoutube />
              </SocialIcon>
              <SocialIcon>
                <FaFacebookF />
              </SocialIcon>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/30 mt-10 pt-6 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} SmartBazar Ltd. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

/* Reusable Social Icon Button */
function SocialIcon({ children }) {
  return (
    <div className="w-10 h-10 flex items-center justify-center
                    rounded-full bg-white/20 hover:bg-white/30
                    transition cursor-pointer
                    text-lg">
      {children}
    </div>
  );
}

export default Footer;
