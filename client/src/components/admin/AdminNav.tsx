import React, { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { FaChartLine, FaCalendarAlt, FaUsers, FaCog, FaTags, FaHome, FaClipboardList } from 'react-icons/fa';

const AdminNav = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = useMemo(() => [
    { to: '/admin', icon: <FaHome className="mr-3" />, label: 'Dashboard' },
    { to: '/admin/appointments', icon: <FaCalendarAlt className="mr-3" />, label: 'Appointments' },
    { to: '/admin/services', icon: <FaClipboardList className="mr-3" />, label: 'Services' },
    ...(user?.role === 'superadmin' ? [{ 
      to: '/admin/users', 
      icon: <FaUsers className="mr-3" />, 
      label: 'Users' 
    }] : []),
    { to: '/admin/offers', icon: <FaTags className="mr-3" />, label: 'Offers' },
    { to: '/admin/analytics', icon: <FaChartLine className="mr-3" />, label: 'Analytics' },
    { to: '/admin/settings', icon: <FaCog className="mr-3" />, label: 'Settings' },
  ], [user?.role]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          bg-gray-800 text-white w-64 min-h-screen flex flex-col fixed lg:static
          transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-200 ease-in-out z-40
        `}
      >
        <div className="p-4 border-b border-gray-700 hidden lg:block">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          {user && (
            <div className="text-sm text-gray-400 mt-1">
              {user.name} ({user.role})
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-pink-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AdminNav;
