import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            About Us
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Our Story
              </h2>
              <p className="text-gray-600">
                Welcome to our premium beauty salon, where we transform your beauty journey into an unforgettable experience. 
                With years of expertise and a passion for excellence, we've become the go-to destination for women seeking 
                exceptional beauty services in a luxurious setting.
              </p>
              <p className="text-gray-600">
                Our team of skilled professionals combines artistry with cutting-edge techniques to bring out your natural 
                beauty. We believe in creating a personalized experience for each client, ensuring you leave feeling not 
                just beautiful, but empowered.
              </p>
            </div>

            {/* Values Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Our Values
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Excellence in Service</p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Personalized Experience</p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Professional Expertise</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sarah Johnson</h3>
                <p className="text-gray-600">Senior Stylist</p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Emily Wilson</h3>
                <p className="text-gray-600">Beauty Therapist</p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sophia Brown</h3>
                <p className="text-gray-600">Makeup Artist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
