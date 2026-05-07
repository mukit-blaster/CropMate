import React, { useState } from 'react';
import { Leaf, Droplets, Thermometer, FlaskConical, Sprout, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import useAuth from '../hooks/useAuth';
import api from '../lib/api';

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
  const [copied, setCopied] = useState(false);

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data } = await api.post('/api/ai/predict-crop', formData);
      setResult(data.prediction);

      if (user?.uid && data.prediction) {
        try {
          await api.post('/api/predictions', {
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
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error?.response?.data?.message || "Failed to get prediction. Make sure GEMINI_API_KEY is configured on the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">AI Crop Predictor</h1>
          <p className="text-sm text-gray-600">Enter soil details to get the best farming advice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-2xl shadow-md">

          {/* Left Side: Form */}
          <div>
            <h2 className="text-base font-semibold text-green-700 mb-4 flex items-center gap-2">
              <FlaskConical className="w-4 h-4" /> Soil Parameters
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
          <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-green-700">
                <Sprout className="w-10 h-10 animate-pulse mb-2" />
                <p className="text-sm font-medium">Analyzing soil & weather…</p>
              </div>
            ) : result ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-green-800 flex items-center gap-2">
                    <Leaf className="w-4 h-4" /> AI Recommendation
                  </h3>
                  <button
                    onClick={copyResult}
                    className="text-xs flex items-center gap-1 text-green-700 hover:text-green-900 px-2 py-1 rounded-md hover:bg-green-100"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 max-h-[420px] overflow-y-auto">
                  <article className="prose prose-sm max-w-none prose-headings:text-green-800 prose-strong:text-secondary prose-h2:mt-4 prose-h2:mb-1 prose-h3:mt-3 prose-h3:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-hr:my-3">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </article>
                </div>
              </>
            ) : (
              <div className="flex-1 text-center text-gray-400 flex flex-col justify-center">
                <Sprout className="w-14 h-14 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Fill the form and let AI decide the best crop for your land.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CropPredictor;