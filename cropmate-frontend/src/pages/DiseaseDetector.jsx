import React, { useState } from 'react';
import { Upload, Camera, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DiseaseDetector = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAnalysis(null); // Reset previous result
    }
  };

  const handleIdentify = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5004/api/detect-disease', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data.analysis);

      // Save detection to our backend if user is logged in
      if (user?.uid && data.analysis) {
        try {
          // Upload image to get URL (or use existing if already uploaded)
          let imageUrl = null;
          if (image) {
            const imageFormData = new FormData();
            imageFormData.append('image', image);
            const imgbbRes = await axios.post(
              `https://api.imgbb.com/1/upload?key=6c4bcdca2f2708f455e46b0f31549904`,
              imageFormData
            );
            imageUrl = imgbbRes?.data?.data?.url;
          }

          await axios.post(`${API_URL}/api/detections`, {
            userId: user.uid,
            userName: user.displayName || 'User',
            userEmail: user.email || '',
            imageUrl: imageUrl || preview,
            analysis: data.analysis,
          });
        } catch (saveError) {
          console.error('Error saving detection:', saveError);
          // Don't show error to user, detection still works
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Plant Doctor AI</h1>
          <p className="text-gray-600">Upload a photo of your plant leaf to detect diseases and get remedies.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="border-2 border-dashed border-green-300 rounded-xl p-8 flex flex-col items-center justify-center bg-green-50/50 hover:bg-green-50 transition h-80 relative">
              
              {preview ? (
                <img src={preview} alt="Preview" className="h-full object-contain rounded-md" />
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG</p>
                </div>
              )}
              
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <button 
              onClick={handleIdentify}
              disabled={!image || loading}
              className={`w-full mt-6 py-3 rounded-lg font-bold text-white transition flex justify-center items-center gap-2
                ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Upload className="w-5 h-5" />}
              {loading ? 'Scanning Plant...' : 'Identify Disease'}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-green-500 min-h-[400px]">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Diagnosis Report</h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-green-600">
                <Loader2 className="w-10 h-10 animate-spin mb-3" />
                <p>Analyzing leaf patterns...</p>
              </div>
            ) : analysis ? (
              <div className="prose prose-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {/* Gemini's text result displayed here */}
                {analysis}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <AlertTriangle className="w-12 h-12 mb-3 opacity-20" />
                <p>No analysis yet. Please upload an image.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DiseaseDetector;