import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      await axios.get("/api/auth/profile");
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <p className="text-gray-600 mb-6">
        Here you can view and manage your profile information.
      </p>

      {error && (
        <div className="mb-6 px-4 py-3 rounded bg-red-100 text-red-700 border border-red-400">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <div>
          <span className="font-semibold text-gray-700">Name:</span>{" "}
          {user?.name}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email:</span>{" "}
          {user?.email}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Phone:</span>{" "}
          {user?.phone || "N/A"}
        </div>
        <div className="mt-8">
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
