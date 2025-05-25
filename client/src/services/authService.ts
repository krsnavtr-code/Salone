// Get headers for authenticated requests
export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    Authorization: `Bearer ${token}`
  } : {};
};
