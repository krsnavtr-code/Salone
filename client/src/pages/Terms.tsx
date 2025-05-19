import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms & Conditions
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600">
                By using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any 
                of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. Services
              </h2>
              <p className="text-gray-600">
                We provide beauty salon services including hair styling, makeup, skincare, and other beauty treatments. 
                All services are subject to availability and may require advance booking.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. Appointments
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Appointments must be booked in advance and are subject to availability.
                </p>
                <p className="text-gray-600">
                  Cancellations must be made at least 24 hours before the scheduled appointment time to avoid charges.
                </p>
                <p className="text-gray-600">
                  Late arrivals may result in shortened service time or rescheduling.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. Payment
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Payment is required at the time of service.
                </p>
                <p className="text-gray-600">
                  We accept cash, credit cards, and debit cards.
                </p>
                <p className="text-gray-600">
                  No-shows or late cancellations may result in a cancellation fee.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                5. Liability
              </h2>
              <p className="text-gray-600">
                While we strive to provide the best possible service, we cannot be held liable for any unforeseen 
                reactions to treatments or products used during your service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                6. Changes to Terms
              </h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms and Conditions at any time. Your continued use of our services 
                after any changes constitutes your acceptance of the new terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
