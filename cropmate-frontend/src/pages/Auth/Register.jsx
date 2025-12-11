import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import GoogleLogin from './GoogleLogin';
import axios from 'axios';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { registerUser, updateUserProfile } = useAuth();

  // Use Vite env variable (set VITE_API_URL in .env) or fallback to localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const photoFile = watch("photo");

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // 1) Upload image to imgbb
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imageAPI = `https://api.imgbb.com/1/upload?key=6c4bcdca2f2708f455e46b0f31549904`;
      const imgbbRes = await axios.post(imageAPI, formData);
      const imageUrl = imgbbRes?.data?.data?.url;

      if (!imageUrl) {
        throw new Error('Image upload failed');
      }

      // 2) Create Firebase user
      const result = await registerUser(data.email, data.password);
      if (!result?.user?.uid) {
        throw new Error('Firebase registration failed');
      }

      // 3) Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: imageUrl,
      });

      // 4) Save user to backend (MongoDB)
      const payload = {
        uid: result.user.uid,
        name: data.name,
        email: data.email,
        photoURL: imageUrl,
        provider: 'firebase',
      };

      await axios.post(`${API_URL}/api/users`, payload);

      // Check if user is admin and redirect accordingly
      const userResponse = await axios.get(`${API_URL}/api/users/${result.user.uid}`);
      const userRole = userResponse.data.user?.role;

      setSuccessMsg('Registration successful! Redirecting...');
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate(location?.state || '/');
        }
      }, 800);
    } catch (error) {
      console.error("Registration error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed. Try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      {/* Header */}
      <h2 className="text-4xl font-extrabold mb-2 text-black">Create an Account</h2>
      <p className="text-gray-800 mb-6">Register with CropMate</p>

      {/* Status messages */}
      {serverError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{serverError}</div>
      )}
      {successMsg && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded">{successMsg}</div>
      )}

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Profile Photo</label>

          {/* Preview */}
          {photoFile && photoFile.length > 0 && (
            <img
              src={URL.createObjectURL(photoFile[0])}
              alt="Preview"
              className="mt-3 w-24 h-24 object-cover rounded-full border mb-3"
            />
          )}

          <input
            type="file"
            accept="image/*"
            {...register("photo", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 
              focus:outline-none focus:ring-2 focus:ring-[#CBEF43] transition"
          />
          {errors.photo && <p className="text-red-500 text-sm mt-1">Photo is required</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#CBEF43] transition"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#CBEF43] transition"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-[#CBEF43] transition"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password?.type === "required" && <p className="text-red-500 text-sm mt-1">Password is required</p>}
          {errors.password?.type === "minLength" && <p className="text-red-500 text-sm mt-1">Minimum 6 characters</p>}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''} bg-[#CBEF43] hover:bg-[#b9dc3d] text-black font-bold py-3 rounded-lg transition`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* Already have account */}
      <p className="mt-4 text-gray-500 text-sm">
        Already have an account?
        <Link state={location.state} to="/login" className="text-[#8FB02D] font-bold ml-1 hover:underline">
          Login
        </Link>
      </p>

      {/* Divider */}
      <div className="relative flex py-6 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-gray-400 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Google Button */}
      <GoogleLogin label="Register with Google" />
    </div>
  );
};

export default Register;
