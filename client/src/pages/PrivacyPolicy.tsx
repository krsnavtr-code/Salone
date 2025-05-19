import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-600">
                We collect personal information that you provide to us when using our services, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Your name and contact information</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Appointment preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Process and manage your appointments</li>
                <li>Provide our services</li>
                <li>Send appointment reminders</li>
                <li>Improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. Data Security
              </h2>
              <p className="text-gray-600">
                We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, 
                disclosure, or destruction of data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. Your Rights
              </h2>
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Access your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                5. Contact Us
              </h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-2">
                <p className="text-gray-600">Email: privacy@salon.com</p>
                <p className="text-gray-600">Phone: (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
