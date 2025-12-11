import React, { useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";
import L from 'leaflet';

import customMarkerIcon from '../assets/location-mark.png';

const Coverage = () => {
  const position = [23.685, 90.3563];
  const serviceCenters = useLoaderData();
  const mapRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customIcon = new L.Icon({
    iconUrl: customMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const location = e.target.location.value.trim();
    if (!location) return;

    if (!serviceCenters) return;

    const found = serviceCenters.find((c) =>
      c.district.toLowerCase().includes(location.toLowerCase())
    );

    if (!found) {
      setIsModalOpen(true);
      return;
    }

    if (mapRef.current) {
      mapRef.current.flyTo([found.latitude, found.longitude], 14, {
        duration: 1.5,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-10 px-6 relative">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-10 shadow-2xl relative z-10">
        <h2 className="text-4xl font-bold text-[#0A2A3F] mb-8">
          We are available in <span className="font-extrabold">64 districts</span>
        </h2>

        <form onSubmit={handleSearch} className="flex items-center gap-3 w-full max-w-xl">
          <div className="flex items-center bg-white border rounded-full px-4 py-2 w-full shadow-sm">
            <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.3" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" name="location" placeholder="Search here" className="w-full outline-none text-gray-700" />
          </div>
          <button type="submit" className="bg-[#A9D92F] px-6 py-2 rounded-full text-[#0A2A3F] font-semibold hover:bg-[#98c52b] transition active:scale-95 transform">
            Search
          </button>
        </form>

        <h3 className="mt-10 mb-4 text-xl font-semibold text-[#0A2A3F]">
          We deliver almost all over Bangladesh
        </h3>

        <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-lg relative z-0">
          <MapContainer center={position} zoom={7} scrollWheelZoom={true} ref={mapRef} className="h-full w-full">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {Array.isArray(serviceCenters) && serviceCenters.map((center, index) => (
              <Marker key={index} position={[center.latitude, center.longitude]} icon={customIcon}>
                <Popup>
                  <strong>{center.district}</strong> <br />
                  Service Areas: {center.covered_area.join(", ")}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center animate-scaleUp">
            
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationCircle className="text-3xl text-red-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Area Not Found</h3>
            <p className="text-gray-500 mb-6">
              Sorry, the district you searched for is currently outside our service coverage area.
            </p>

            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coverage;