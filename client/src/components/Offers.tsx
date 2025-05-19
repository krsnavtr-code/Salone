import React from 'react';

const Offers = () => {
  const offers = [
    {
      title: 'Summer Special Package',
      description: 'Get 20% off on any hair styling service',
      price: 'Starting from $40',
      validUntil: 'June 30, 2024',
    },
    {
      title: 'Spa Day Deal',
      description: 'Book any 2 services and get a free facial',
      price: 'Starting from $60',
      validUntil: 'July 31, 2024',
    },
    {
      title: 'Loyalty Program',
      description: 'Get 10% off on your next visit',
      price: 'After 5 visits',
      validUntil: 'Ongoing',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{offer.title}</h3>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                {offer.validUntil}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{offer.description}</p>
            <div className="text-right">
              <span className="text-pink-600 font-semibold">{offer.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
