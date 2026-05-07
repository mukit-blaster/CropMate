import React, { useState, useEffect } from "react";
import {
  FaLeaf,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCalendarAlt,
  FaLightbulb,
  FaSeedling,
} from "react-icons/fa";
import api from "../lib/api";
import { FALLBACK_IMAGE, handleImageError } from "../lib/image";

const Knowledge = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Rice",
    "Vegetables",
    "Fertilizer",
    "Pest Control",
  ];

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/knowledge`, {
        params: { search: searchTerm || undefined, category: activeCategory !== 'All' ? activeCategory : undefined }
      });
      if (response.data && response.data.tips) {
        setTips(response.data.tips);
      }
    } catch (error) {
      console.error('Error fetching knowledge tips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [activeCategory, searchTerm]);

  // Logic to Filter
  const filteredTips = tips.filter((tip) => {
    const matchesCategory =
      activeCategory === "All" || tip.category === activeCategory;
    const matchesSearch = tip.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner text-success text-6xl mb-4"></div>
          <p className="text-gray-600">Loading knowledge tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* ================= HERO HEADER ================= */}
      <div className="relative bg-green-700 text-white pt-6 pb-12 px-4 rounded-b-3xl shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-800/50 px-3 py-1 rounded-full text-green-200 text-xs font-semibold mb-3 border border-green-600 backdrop-blur-sm">
            <FaSeedling /> Expert Farming Insights
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
            Cultivate Your Knowledge
          </h1>
          <p className="text-green-100 text-sm max-w-lg mx-auto">
            Discover proven techniques to increase your yield and protect your crops.
          </p>
        </div>

        <div className="max-w-xl mx-auto mt-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search guides..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 shadow-md placeholder-gray-400 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="max-w-6xl mx-auto px-4 mt-5">
        {/* Category Pills */}
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap font-semibold text-xs transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-green-700 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => (
            <div
              key={tip._id || tip.id}
              className={`bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full ${
                expandedId === (tip._id || tip.id)
                  ? "ring-2 ring-green-500 ring-opacity-50"
                  : ""
              }`}
            >
              {/* Image Container - Fixed Aspect Ratio */}
              <div className="h-36 relative overflow-hidden">
                <img
                  src={tip.image || FALLBACK_IMAGE}
                  alt={tip.title}
                  loading="lazy"
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-gray-100"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                  <FaLeaf size={10} /> {tip.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Meta Info */}
                <div className="flex justify-between items-center text-[11px] text-gray-400 font-semibold mb-2">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt /> {tip.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock /> {tip.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-800 mb-1.5 leading-snug group-hover:text-green-700 transition-colors">
                  {tip.title}
                </h3>

                <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-grow">
                  {tip.short}
                </p>

                {/* Read Button */}
                <button
                  onClick={() => toggleExpand(tip._id || tip.id)}
                  className="w-full py-2 rounded-lg text-xs font-bold transition-colors bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700 flex items-center justify-center gap-2"
                >
                  {expandedId === (tip._id || tip.id) ? "Close Guide" : "Read Full Guide"}
                  {expandedId === (tip._id || tip.id) ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {/* Expandable Section */}
              {expandedId === (tip._id || tip.id) && (
                <div className="bg-green-50 p-6 border-t border-green-100 animate-fadeIn">
                  <div className="flex gap-3">
                    <FaLightbulb className="text-yellow-500 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        Expert Advice
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {tip.full}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <FaLeaf className="text-6xl mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-bold text-gray-400">No tips found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Knowledge;

