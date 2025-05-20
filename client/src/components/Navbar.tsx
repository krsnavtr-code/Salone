import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-11">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-pink-600">
                Beauty Salon
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center my-2 border-b-2 text-sm font-medium ${
                location.pathname === "/"
                  ? "border-pink-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`inline-flex items-center my-2 border-b-2 text-sm font-medium ${
                location.pathname === "/services"
                  ? "border-pink-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Services
            </Link>
            <Link
              to="/gallery"
              className={`inline-flex items-center my-2 border-b-2 text-sm font-medium ${
                location.pathname === "/gallery"
                  ? "border-pink-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/booking"
              className={`inline-flex items-center my-2 border-b-2 text-sm font-medium ${
                location.pathname === "/booking"
                  ? "border-pink-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Book
            </Link>
            <Link
              to="/offers"
              className={`inline-flex items-center my-2 border-b-2 text-sm font-medium ${
                location.pathname === "/offers"
                  ? "border-pink-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Offers
            </Link>
            <Link
              to="/testimonials"
              className={`inline-flex items-center my-2 border-b-2 text-sm font-medium ${
                location.pathname === "/testimonials"
                  ? "border-pink-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Testimonials
            </Link>
            <Link
              to="/contact"
              className={`inline-flex items-center my-2 border-b-2 text-sm font-medium ${
                location.pathname === "/contact"
                  ? "border-pink-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Contact
            </Link>

            {!user && (
              <Link
                to="/login"
                className="inline-flex items-center my-2 px-2 py-1 border border-transparent text-sm font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all ml-4"
              >
                Login
              </Link>
            )}
            {user && (
              <Link
                to="/profile"
                className="inline-flex items-center my-2 px-2 py-1 border border-transparent text-sm font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all ml-4"
              >
                Profile
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {[
            "/",
            "/services",
            "/gallery",
            "/booking",
            "/offers",
            "/testimonials",
            "/contact",
          ].map((path) => {
            const label =
              path === "/"
                ? "Home"
                : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === path
                    ? "bg-pink-50 text-pink-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {!user && (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 mt-2 rounded-md text-base font-medium text-pink-700 bg-pink-100 hover:bg-pink-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
