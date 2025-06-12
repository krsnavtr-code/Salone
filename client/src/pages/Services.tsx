import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../services/api';

interface ServiceItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string;
  is_active: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
}

interface ServiceCategory {
  category: string;
  items: ServiceItem[];
}

const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample data as fallback
  const getSampleServices = (): ServiceCategory[] => {
    const sampleServices: ServiceItem[] = [
      { 
        id: 1, 
        name: "Women's Haircut & Blow Dry", 
        price: 1500, 
        duration: 60, 
        category: 'Hair Services', 
        is_active: true, 
        slug: 'womens-haircut-blow-dry', 
        description: 'Professional haircut and blow dry', 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      },
      { 
        id: 2, 
        name: 'Classic Facial', 
        price: 1200, 
        duration: 45, 
        category: 'Skin Care', 
        is_active: true, 
        slug: 'classic-facial', 
        description: 'Basic facial treatment', 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      }
    ];

    // Group services by category
    const groupedServices = sampleServices.reduce<Record<string, ServiceItem[]>>((acc, service) => {
      const category = service.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});

    // Convert to array format
    return Object.entries(groupedServices).map(([category, items]) => ({
      category,
      items: items as ServiceItem[]
    }));
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceApi.getAllServices();
        
        // Ensure the response is an array
        const allServices = Array.isArray(response) ? response : [];
        
        // Group services by category with proper typing
        const groupedServices = allServices.reduce<Record<string, ServiceItem[]>>((acc, service) => {
          // Ensure service has required properties
          const category = typeof service.category === 'string' ? service.category : 'Other';
          if (!acc[category]) {
            acc[category] = [];
          }
          
          // Create a properly typed service item
          const serviceItem: ServiceItem = {
            id: typeof service.id === 'number' ? service.id : Date.now(),
            name: typeof service.name === 'string' ? service.name : 'Unnamed Service',
            description: typeof service.description === 'string' ? service.description : null,
            price: typeof service.price === 'number' ? service.price : 
                  typeof service.price === 'string' ? parseFloat(service.price) || 0 : 0,
            duration: typeof service.duration === 'number' ? service.duration :
                     typeof service.duration === 'string' ? parseInt(service.duration, 10) || 30 : 30,
            category,
            is_active: Boolean(service.is_active),
            slug: typeof service.slug === 'string' ? service.slug : '',
            created_at: typeof service.created_at === 'string' ? service.created_at : new Date().toISOString(),
            updated_at: typeof service.updated_at === 'string' ? service.updated_at : new Date().toISOString()
          };
          
          acc[category].push(serviceItem);
          return acc;
        }, {});
        
        // Convert to array format with proper typing
        const formattedServices: ServiceCategory[] = Object.entries(groupedServices).map(([category, items]) => ({
          category,
          items: items as ServiceItem[]
        }));
        
        setServices(formattedServices);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to load services. Using sample data instead.');
        setServices(getSampleServices());
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white text-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-red-50 rounded-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Services</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen">
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

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Menu</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our range of professional beauty and grooming services
              designed to make you look and feel your best.
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-12">
            {services.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-6">
                  <h3 className="text-2xl font-bold">{category.category}</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {category.items.map((item, itemIndex) => (
                          <tr 
                            key={itemIndex} 
                            className="hover:bg-pink-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              {item.description && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {item.description}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {item.duration} min
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <span className="text-pink-600 font-bold">
                                ₹{Number(item.price).toLocaleString('en-IN')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Offers Section */}
          <div className="mt-16 bg-pink-50 p-8 rounded-xl shadow-inner">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-pink-600 mb-2">Special Offers</h3>
              <p className="text-gray-600">Exclusive deals just for you</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-pink-500 text-3xl mb-3">🎁</div>
                <h4 className="font-semibold text-lg mb-2">First Visit</h4>
                <p className="text-gray-600 mb-3">15% off on your first service</p>
                <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">NEW CUSTOMER</span>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-pink-500 text-3xl mb-3">✨</div>
                <h4 className="font-semibold text-lg mb-2">Combo Package</h4>
                <p className="text-gray-600 mb-3">Haircut + Facial for just ₹2500</p>
                <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">POPULAR</span>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-pink-500 text-3xl mb-3">👑</div>
                <h4 className="font-semibold text-lg mb-2">Loyalty Program</h4>
                <p className="text-gray-600 mb-3">Earn points on every visit</p>
                <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">REGULAR CUSTOMERS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
