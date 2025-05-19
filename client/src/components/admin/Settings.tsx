import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface SalonSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  workingDays: string[];
  businessHours: {
    start: string;
    end: string;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      setSettings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch settings');
      setLoading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;

    const { name, value } = e.target;
    const updatedSettings = { ...settings, [name]: value };
    
    try {
      await api.put('/admin/settings', updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  const handleTimeChange = async (day: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;

    const updatedSettings = { ...settings };
    updatedSettings.openingHours[day] = e.target.value;
    
    try {
      await api.put('/admin/settings', updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  const handleSocialLinkChange = async (platform: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;

    const updatedSettings = { ...settings };
    updatedSettings.socialLinks[platform] = e.target.value;
    
    try {
      await api.put('/admin/settings', updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Settings</h2>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">General Settings</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Salon Name</label>
            <input
              type="text"
              name="name"
              value={settings?.name || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={settings?.address || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={settings?.phone || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={settings?.email || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
        <div className="space-y-4">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
            <div key={day}>
              <label className="block text-sm font-medium text-gray-700">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <input
                type="time"
                value={settings?.openingHours[day] || ''}
                onChange={(e) => handleTimeChange(day, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Social Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook</label>
            <input
              type="url"
              value={settings?.socialLinks.facebook || ''}
              onChange={(e) => handleSocialLinkChange('facebook', e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram</label>
            <input
              type="url"
              value={settings?.socialLinks.instagram || ''}
              onChange={(e) => handleSocialLinkChange('instagram', e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Twitter</label>
            <input
              type="url"
              value={settings?.socialLinks.twitter || ''}
              onChange={(e) => handleSocialLinkChange('twitter', e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="https://twitter.com/yourpage"
            />
          </div>
        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Staff Management</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Working Days</label>
            <div className="mt-2 space-y-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={day}
                    checked={settings?.workingDays?.includes(day.toLowerCase()) || false}
                    onChange={(e) => {
                      if (!settings) return;
                      const updatedSettings = { ...settings };
                      if (e.target.checked) {
                        updatedSettings.workingDays.push(day.toLowerCase());
                      } else {
                        updatedSettings.workingDays = updatedSettings.workingDays.filter(
                          (d) => d !== day.toLowerCase()
                        );
                      }
                      api
                        .put('/admin/settings', updatedSettings)
                        .then(() => setSettings(updatedSettings))
                        .catch(() => setError('Failed to update settings'));
                    }}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor={day} className="ml-2 block text-sm text-gray-900">
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Hours</label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={settings?.businessHours?.start || ''}
                  onChange={(e) => {
                    if (!settings) return;
                    const updatedSettings = { ...settings };
                    updatedSettings.businessHours.start = e.target.value;
                    api
                      .put('/admin/settings', updatedSettings)
                      .then(() => setSettings(updatedSettings))
                      .catch(() => setError('Failed to update settings'));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={settings?.businessHours?.end || ''}
                  onChange={(e) => {
                    if (!settings) return;
                    const updatedSettings = { ...settings };
                    updatedSettings.businessHours.end = e.target.value;
                    api
                      .put('/admin/settings', updatedSettings)
                      .then(() => setSettings(updatedSettings))
                      .catch(() => setError('Failed to update settings'));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
