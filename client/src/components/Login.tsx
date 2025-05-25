import React, { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaHome } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const from = location.state?.from?.pathname || '/';
  const redirectUrl = searchParams.get('redirect') || from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const success = await login(email, password);
      if (success) {
        navigate(redirectUrl);
      } else {
        setError("Invalid credentials");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during login"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full border border-pink-100">
        <a className="absolute hover:text-pink-600" href="/"><FaHome /></a>
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Please login to manage your salon experience
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition duration-200"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-pink-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
