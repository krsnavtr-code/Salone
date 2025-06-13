import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { format, addDays, isBefore, parseISO, isSameDay } from 'date-fns';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  category: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Stylist {
  id: string;
  name: string;
  specialization: string;
  image?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

const Booking = () => {
  const { user, loading, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // States
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedStylist, setSelectedStylist] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // Get current service details
  const currentService = services.find(s => s.id === selectedService);
  
  // Generate dates for the next 30 days
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      display: format(date, 'EEE, MMM d'),
      isToday: isSameDay(date, new Date())
    };
  });

  // Generate time slots (9 AM to 6 PM, every 30 minutes)
  useEffect(() => {
    if (!currentService) return;
    
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 18;   // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // For demo, mark some random slots as unavailable
        const available = Math.random() > 0.3; // 70% chance of being available
        slots.push({ time: timeString, available });
      }
    }
    
    setTimeSlots(slots);
  }, [currentService]);

  // Fetch services and stylists on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const [servicesRes, stylistsRes] = await Promise.all([
          api.get('/services'),
          api.get('/stylists')
        ]);
        setServices(servicesRes.data);
        setStylists(stylistsRes.data);
      } catch (err) {
        setError('Failed to load booking data. Please try again later.');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: '/booking' } });
      return;
    }
    
    if (!selectedService || !selectedDate || !selectedTime || !selectedStylist) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const appointmentData = {
        serviceId: selectedService,
        stylistId: selectedStylist,
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim() || undefined,
        userId: user.id
      };
      
      await api.post('/appointments', appointmentData);
      
      // Show success message and redirect to appointments page
      setSuccess('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/profile/appointments');
      }, 1500);
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      // Store the intended path
      localStorage.setItem('redirectAfterLogin', location.pathname);
      // Open the login modal
      openLoginModal();
    }
  }, [user, loading, openLoginModal, location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Book Your Appointment
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Schedule your perfect salon experience
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-8 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error}
                </h3>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {success}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Selection */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">1. Select a Service</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div 
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                        selectedService === service.id 
                          ? 'border-pink-500 bg-pink-50' 
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-500">{service.duration} min • ${service.price.toFixed(2)}</p>
                        </div>
                        {selectedService === service.id && (
                          <div className="flex-shrink-0 text-pink-600">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedService && (
                <>
                  {/* Stylist Selection */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">2. Choose Your Stylist</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {stylists.map((stylist) => (
                        <div 
                          key={stylist.id}
                          onClick={() => setSelectedStylist(stylist.id)}
                          className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                            selectedStylist === stylist.id 
                              ? 'border-pink-500 bg-pink-50' 
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <span className="text-xl">{stylist.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{stylist.name}</h3>
                              <p className="text-sm text-gray-500">{stylist.specialization}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">3. Select Date & Time</h2>
                    
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Available Dates</h3>
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {availableDates.map((day) => (
                          <button
                            key={day.date}
                            type="button"
                            onClick={() => setSelectedDate(day.date)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                              selectedDate === day.date
                                ? 'bg-pink-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <div className="text-xs font-normal">{day.display.split(',')[0]}</div>
                            <div className="text-sm font-semibold">{day.display.split(',')[1].trim()}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3">Available Time Slots</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                              selectedTime === slot.time
                                ? 'bg-pink-600 text-white'
                                : slot.available
                                ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-3">4. Additional Notes (Optional)</h2>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or notes for your stylist..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Your Booking Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium">
                          {currentService?.name || 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stylist:</span>
                        <span className="font-medium">
                          {stylists.find(s => s.id === selectedStylist)?.name || 'Any available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">
                          {selectedDate ? format(new Date(selectedDate), 'EEEE, MMMM d, yyyy') : 'Not selected'}
                          {selectedTime && ` at ${selectedTime}`}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 my-3"></div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${currentService?.price.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedService || !selectedDate || !selectedTime}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isSubmitting || !selectedService || !selectedDate || !selectedTime
                          ? 'bg-pink-300 cursor-not-allowed'
                          : 'bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Book Appointment'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
