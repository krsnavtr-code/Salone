import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return;
      }
      if (!formData.email.trim()) {
        setError('Please enter your email');
        return;
      }
      if (!formData.password.trim()) {
        setError('Please enter a password');
        return;
      }

      // Register with our backend
      const success = await register(formData);
      if (success) {
        // Show success message and redirect to appointments page
        setError('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1000); // Reduced delay to 1 second
      } else {
        setError("Registration failed. Please check your details and try again.");
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error.message.includes('email already registered')) {
        setError('This email is already registered. Please use a different email or login.');
      } else if (error.message.includes('Invalid credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(error.message || "An unexpected error occurred during registration. Please try again later.");
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full border border-pink-100">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Create an Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join our salon family to book, manage, and explore services
        </p>

        {error && (
          <div className="mb-4 p-4 rounded-lg">
            {error.includes('successful') ? (
              <div className="bg-green-50 text-green-600">
                {error}
              </div>
            ) : (
              <div className="bg-red-50 text-red-600">
                {error}
              </div>
            )}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="Enter your mobile number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-pink-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
