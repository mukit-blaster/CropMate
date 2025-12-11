import React, { useState } from 'react';
import { Leaf, Droplets, Thermometer, FlaskConical, Sprout } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CropPredictor = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    soilType: '',
    phLevel: '',
    humidity: '',
    temperature: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Get prediction from external API
      const response = await fetch('http://localhost:5004/api/predict-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data.prediction);

      // Save prediction to our backend if user is logged in
      if (user?.uid && data.prediction) {
        try {
          await axios.post(`${API_URL}/api/predictions`, {
            userId: user.uid,
            userName: user.displayName || 'User',
            userEmail: user.email || '',
            soilType: formData.soilType,
            phLevel: formData.phLevel,
            humidity: formData.humidity,
            temperature: formData.temperature,
            prediction: data.prediction,
          });
        } catch (saveError) {
          console.error('Error saving prediction:', saveError);
          // Don't show error to user, prediction still works
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Crop Predictor</h1>
          <p className="text-gray-600">Enter soil details to get the best farming advice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-lg">
          
          {/* Left Side: Form */}
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-6 flex items-center gap-2">
              <FlaskConical className="w-6 h-6" /> Soil Parameters
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                <select 
                  name="soilType" 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                >
                  <option value="">Select Soil Type</option>
                  <option value="Loamy">Loamy (দোআঁশ)</option>
                  <option value="Clay">Clay (লে এঁটেল)</option>
                  <option value="Sandy">Sandy (বেলে)</option>
                  <option value="Silt">Silt (পলি)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
                  <div className="relative">
                    <FlaskConical className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input type="number" step="0.1" name="phLevel" onChange={handleChange} placeholder="e.g. 6.5" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input type="number" name="temperature" onChange={handleChange} placeholder="e.g. 28" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input type="number" name="humidity" onChange={handleChange} placeholder="e.g. 70" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" required />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300 flex justify-center items-center gap-2"
              >
                {loading ? 'Analyzing...' : <><Sprout className="w-5 h-5" /> Predict Best Crop</>}
              </button>
            </form>
          </div>

          {/* Right Side: Result */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex flex-col justify-center">
            {result ? (
              <div className="prose prose-green">
                <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                   <Leaf className="w-6 h-6"/> Recommendation
                </h3>
                {/* JSON বা Text সুন্দর করে দেখানোর জন্য */}
                <div className="whitespace-pre-wrap text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  {result}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Sprout className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p>Fill the form and let AI decide the best crop for your land.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CropPredictor;