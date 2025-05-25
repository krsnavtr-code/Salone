import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookAppointment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: '/booking' } });
    } else {
      navigate('/booking');
    }
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-pink-50 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-pink-600">
            Redefining Beauty for Every Woman
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Welcome to our luxurious salon — where beauty meets relaxation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleBookAppointment}
              className="px-8 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
            >
              Book Appointment
            </button>
            {/* {!user && (
              <a
                href="/login"
                className="px-8 py-3 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 transition"
              >
                Login
              </a>
            )} */}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Hair Styling", desc: "Trendy cuts, coloring & care" },
              { title: "Facials", desc: "Glow up with premium facial packs" },
              { title: "Manicure & Pedicure", desc: "Polish, care & relax" },
              { title: "Makeup", desc: "Occasion-ready looks" },
              { title: "Spa", desc: "Relaxing body & head massages" },
              {
                title: "Bridal Packages",
                desc: "Full bridal beauty solutions",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-6 border rounded-xl hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2 text-pink-600">
                  {s.title}
                </h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Gallery</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <img
                key={i}
                src={`https://source.unsplash.com/400x300/?salon,beauty,${i}`}
                alt={`gallery ${i}`}
                className="rounded-lg shadow-md hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Current Offers</h2>
          <p className="text-lg text-gray-600 mb-4">
            Limited time discounts for our special clients!
          </p>
          <ul className="text-pink-600 font-medium space-y-3">
            <li>💅 20% off on your first visit</li>
            <li>💆 Buy 2 Spa sessions, get 1 free</li>
            <li>👰 Exclusive bridal package – 30% off</li>
          </ul>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-pink-100 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Priya", text: "Amazing staff and excellent services!" },
              { name: "Anjali", text: "I always feel like a queen here." },
              { name: "Ritika", text: "Best salon experience I’ve ever had." },
              { name: "Simran", text: "Highly recommend their bridal makeup!" },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md text-left"
              >
                <p className="text-gray-700 italic">"{t.text}"</p>
                <p className="mt-4 font-bold text-pink-600">- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-lg mb-4">Have questions? Want to book manually?</p>
          <p>📍 123 Salon Street, YourCity, India</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 contact@yourbeautysalon.com</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-600 text-white text-center py-6">
        <p>
          © {new Date().getFullYear()} Your Beauty Salon. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
