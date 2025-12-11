import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import GoogleLogin from './GoogleLogin';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {signInUser} = useAuth();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signInUser(data.email, data.password);
      console.log(result.user);

      // Save/update user in backend
      try {
        const payload = {
          uid: result.user.uid,
          name: result.user.displayName || 'User',
          email: result.user.email,
          photoURL: result.user.photoURL,
          provider: 'firebase',
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
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {/* Header Section */}
      <h2 className="text-4xl font-extrabold mb-2 text-black">Welcome Back</h2>
      <p className="text-gray-800 mb-8">Login with CropMate</p>

      {/* Login Form */}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Email Field */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input 
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-[#CBEF43] focus:border-transparent transition"
          />
          
          {errors.email?.type === "required" && (
            <p className="text-red-500 text-sm mt-1">Email is required</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#CBEF43] focus:border-transparent transition"
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>

          {errors.password?.type === "required" && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
        </div>

        {/* Forget Password */}
        {/* <div className="flex justify-start">
          <a href="#" className="text-gray-500 text-sm font-medium underline hover:text-gray-700">
            Forget Password?
          </a>
        </div> */}

        {/* Login Button */}
        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-[#D0EF5B] hover:bg-[#bfe04a] text-black font-bold py-3 rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-4 text-gray-500 text-sm">
        Don't have any account?  
        <Link state={location.state} to="/register" className="text-[#8FB02D] font-bold hover:underline"> Register</Link>
      </p>

      {/* Or Divider */}
      <div className="relative flex py-6 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-gray-400 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Google Login Button */}
     <GoogleLogin label="Login with Google" />
    </div>
  );
};

export default Login;
