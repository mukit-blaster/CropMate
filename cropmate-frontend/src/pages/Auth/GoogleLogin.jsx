import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const GoogleLogin = ({ label = "Login with Google" }) => {
  const { signInGoogle } = useAuth();
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInGoogle();
      console.log("Google user:", result.user);

      // Save/update user in backend
      try {
        const payload = {
          uid: result.user.uid,
          name: result.user.displayName || 'User',
          email: result.user.email,
          photoURL: result.user.photoURL,
          provider: 'google',
        };
        await axios.post(`${API_URL}/api/users`, payload);

        // Check if user is admin and redirect accordingly
        const userResponse = await axios.get(`${API_URL}/api/users/${result.user.uid}`);
        const userRole = userResponse.data.user?.role;

        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate(location?.state || '/');
        }
      } catch (error) {
        console.error('Error saving user to backend:', error);
        // Still navigate even if backend save fails
        navigate(location?.state || '/');
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`w-full bg-[#EAECEF] hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg 
                 flex items-center justify-center gap-2 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <FcGoogle className="w-5 h-5" />
      {loading ? 'Logging in...' : label}
    </button>
  );
};

export default GoogleLogin;
