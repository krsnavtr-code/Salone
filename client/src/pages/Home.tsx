import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Redefining Beauty for Every Woman
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience our premium salon services in a luxurious and welcoming
            environment
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/booking"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
            >
              Book Appointment
            </a>
            {!user && (
              <a
                href="/login"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
