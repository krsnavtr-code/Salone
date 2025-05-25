import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Services = () => {
  const services = [
    {
      category: "Hair Services",
      items: [
        { name: "Women's Haircut & Blow Dry", price: 1500, duration: "60 min" },
        { name: "Men's Haircut", price: 800, duration: "30 min" },
        { name: "Hair Coloring (Full)", price: 3500, duration: "120 min" },
        {
          name: "Hair Highlights (Full Head)",
          price: 4500,
          duration: "180 min",
        },
        { name: "Hair Spa Treatment", price: 2500, duration: "90 min" },
        { name: "Keratin Treatment", price: 6000, duration: "180 min" },
      ],
    },
    {
      category: "Skin Care",
      items: [
        { name: "Classic Facial", price: 1500, duration: "60 min" },
        { name: "Gold Facial", price: 2500, duration: "75 min" },
        { name: "Diamond Facial", price: 3500, duration: "90 min" },
        { name: "Fruit Facial", price: 2000, duration: "75 min" },
        { name: "Bleach & Cleanup", price: 1200, duration: "60 min" },
        { name: "Threading (Full Face)", price: 500, duration: "30 min" },
      ],
    },
    {
      category: "Nail Care",
      items: [
        { name: "Manicure (Basic)", price: 800, duration: "45 min" },
        { name: "Pedicure (Basic)", price: 1000, duration: "60 min" },
        { name: "Manicure (Deluxe)", price: 1500, duration: "60 min" },
        { name: "Pedicure (Deluxe)", price: 1800, duration: "75 min" },
        { name: "Nail Art (Per Nail)", price: 100, duration: "15 min" },
        { name: "Gel Polish (Hands)", price: 2000, duration: "90 min" },
      ],
    },
    {
      category: "Bridal Packages",
      items: [
        { name: "Bridal Makeup (Basic)", price: 8000, duration: "180 min" },
        { name: "Bridal Makeup (Premium)", price: 15000, duration: "240 min" },
        {
          name: "Bridal Hair & Makeup Trial",
          price: 3500,
          duration: "120 min",
        },
        { name: "Bride + 2 (Makeup)", price: 18000, duration: "300 min" },
        { name: "Sangeet Makeup", price: 5000, duration: "120 min" },
        { name: "Reception Makeup", price: 7000, duration: "150 min" },
      ],
    },
  ];

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="bg-pink-50 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-pink-600">
            Our Services & Pricing
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Transparent pricing for all our premium salon services
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Menu</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of beauty services at competitive prices.
              All prices are in INR and include taxes. Duration is approximate
              and may vary.
            </p>
          </div>

          <div className="space-y-12">
            {services.map((category, index) => (
              <div key={index} className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-pink-600 border-b-2 border-pink-100 pb-2">
                  {category.category}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-pink-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Service
                        </th>
                        <th className="py-3 px-4 text-right font-semibold text-gray-700">
                          Price (₹)
                        </th>
                        <th className="py-3 px-4 text-right font-semibold text-gray-700">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {category.items.map((service, idx) => (
                        <tr key={idx} className="hover:bg-pink-50 transition">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-800">
                              {service.name}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-medium text-pink-600">
                            ₹{service.price.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right text-gray-600">
                            {service.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-pink-50 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4 text-pink-600">
              Special Offers
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-pink-500 text-2xl mb-2">🎁</div>
                <h4 className="font-semibold">First Visit</h4>
                <p className="text-sm text-gray-600">
                  15% off on your first service
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-pink-500 text-2xl mb-2">💝</div>
                <h4 className="font-semibold">Combo Package</h4>
                <p className="text-sm text-gray-600">
                  Haircut + Facial at 20% off
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-pink-500 text-2xl mb-2">👯</div>
                <h4 className="font-semibold">Group Booking</h4>
                <p className="text-sm text-gray-600">
                  10% off for groups of 3+
                </p>
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/booking"
                className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
