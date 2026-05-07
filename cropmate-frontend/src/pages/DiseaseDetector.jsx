import React, { useState } from 'react';
import { Upload, Camera, CheckCircle, AlertTriangle, Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import api from '../lib/api';

const DiseaseDetector = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyAnalysis = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

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
      const { data } = await api.post('/api/ai/detect-disease', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(data.analysis);

      if (user?.uid && data.analysis) {
        try {
          let imageUrl = null;
          try {
            const imageFormData = new FormData();
            imageFormData.append('image', image);
            const imgbbRes = await axios.post(
              `https://api.imgbb.com/1/upload?key=6c4bcdca2f2708f455e46b0f31549904`,
              imageFormData
            );
            imageUrl = imgbbRes?.data?.data?.url;
          } catch (_) {
            // imgbb is optional; fall back to preview blob URL
          }

          await api.post('/api/detections', {
            userId: user.uid,
            userName: user.displayName || 'User',
            userEmail: user.email || '',
            imageUrl: imageUrl || preview,
            analysis: data.analysis,
          });
        } catch (saveError) {
          console.error('Error saving detection:', saveError);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error?.response?.data?.message || "Something went wrong! Make sure GEMINI_API_KEY is configured on the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Plant Doctor AI</h1>
          <p className="text-sm text-gray-600">Upload a photo of your plant leaf to detect diseases and get remedies.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Upload Section */}
          <div className="bg-white p-4 rounded-2xl shadow-md">
            <div className="border-2 border-dashed border-green-300 rounded-xl p-6 flex flex-col items-center justify-center bg-green-50/50 hover:bg-green-50 transition h-60 relative">
              
              {preview ? (
                <img src={preview} alt="Preview" className="h-full object-contain rounded-md" />
              ) : (
                <div className="text-center">
                  <Camera className="w-10 h-10 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-medium">Click to upload or drag & drop</p>
                  <p className="text-[11px] text-gray-400 mt-1">Supports JPG, PNG</p>
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
              className={`w-full mt-4 py-2.5 rounded-lg text-sm font-bold text-white transition flex justify-center items-center gap-2
                ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
              {loading ? 'Scanning Plant...' : 'Identify Disease'}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-white p-4 rounded-2xl shadow-md border-t-4 border-green-500 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <h2 className="text-base font-bold text-gray-800">Diagnosis Report</h2>
              {analysis && !loading && (
                <button
                  onClick={copyAnalysis}
                  className="text-xs flex items-center gap-1 text-green-700 hover:text-green-900 px-2 py-1 rounded-md hover:bg-green-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-green-600">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm">Analyzing leaf patterns…</p>
              </div>
            ) : analysis ? (
              <div className="max-h-[420px] overflow-y-auto pr-1">
                <article className="prose prose-sm max-w-none prose-headings:text-green-800 prose-strong:text-secondary prose-h2:mt-3 prose-h2:mb-1 prose-h3:mt-2 prose-h3:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </article>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <AlertTriangle className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">No analysis yet. Please upload an image.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DiseaseDetector;