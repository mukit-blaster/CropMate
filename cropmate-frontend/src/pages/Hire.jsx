import React, { useState, useEffect } from 'react';
import { 
  FaTractor, FaUserFriends, FaStar, FaMapMarkerAlt, 
  FaSearch, FaFilter, FaClock, FaTimes, FaCheckCircle, 
  FaCalendarAlt, FaPhone, FaClipboardList 
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import api from '../lib/api';

const Hire = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('machines'); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMyHiresOpen, setIsMyHiresOpen] = useState(false); 
    const [bookingStep, setBookingStep] = useState('form');
    const [bookedItems, setBookedItems] = useState([]); 
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        duration: ''
    });

    
    useEffect(() => {
        if (user?.uid) {
            loadUserBookings();
        }
    }, [user]);

    const machines = [
        {
            id: 1,
            name: 'John Deere 5050D',
            type: 'Tractor',
            price: '500৳/hr',
            location: 'Gazipur, Dhaka',
            rating: 4.8,
            available: true,
            image: 'https://i.pinimg.com/736x/c7/8c/10/c78c10b7189ed6f84ab80f5794bca841.jpg', 
        },
        {
            id: 2,
            name: 'Kubota Combine Harvester',
            type: 'Harvester',
            price: '1200৳/hr',
            location: 'Rangpur',
            rating: 4.9,
            available: true,
            image: 'https://i.pinimg.com/736x/ec/ac/a6/ecaca6db16ff1f3000d7e25bed47ca89.jpg',
        },
        {
            id: 3,
            name: 'DJI Agras T40',
            type: 'Spraying Drone',
            price: '2000৳/acre',
            location: 'Cumilla',
            rating: 4.7,
            available: false, 
            image: 'https://i.pinimg.com/736x/3d/09/fc/3d09fc3f0b9efdd60466d56ac8860986.jpg',
        },
        {
            id: 4,
            name: 'Mahindra 575 DI',
            type: 'Tractor',
            price: '550৳/hr',
            location: 'Jessore',
            rating: 4.6,
            available: true,
            image: 'https://i.pinimg.com/736x/64/c7/e4/64c7e4e3abf679553a085a1a882df11a.jpg',
        },
        {
            id: 5,
            name: 'Yanmar Rice Transplanter',
            type: 'Planter',
            price: '1500৳/acre',
            location: 'Sylhet',
            rating: 4.9,
            available: true,
            image: 'https://i.pinimg.com/736x/2b/f1/5f/2bf15f6c8c237d72bef48fab05e3dc5f.jpg',
        },
        {
            id: 6,
            name: 'Power Tiller 12HP',
            type: 'Tiller',
            price: '300৳/hr',
            location: 'Dinajpur',
            rating: 4.3,
            available: true,
            image: 'https://i.pinimg.com/736x/33/8b/5e/338b5e1ac894698eb7b06b39606b9d75.jpg',
        },
        {
            id: 7,
            name: 'Solar Irrigation Pump',
            type: 'Water Pump',
            price: '200৳/hr',
            location: 'Khulna',
            rating: 4.5,
            available: false, 
            image: 'https://i.pinimg.com/736x/c6/12/d7/c612d7ebe4bdf09112a7427b8870caa9.jpg',
        },
        {
            id: 8,
            name: 'New Holland 3630',
            type: 'Tractor',
            price: '600৳/hr',
            location: 'Rajshahi',
            rating: 4.7,
            available: true,
            image: 'https://i.pinimg.com/736x/8a/cc/ec/8accec9ea2b8beb38267ae2f0ef78639.jpg',
        }
    ];

    const laborers = [
        {
            id: 101, 
            name: 'Rahima Uddin',
            skill: 'Expert Planter',
            price: '600৳/day',
            location: 'Mymensingh',
            rating: 4.5,
            experience: '5 Years',
            image: 'https://i.pinimg.com/736x/77/0a/5b/770a5b9af5d43b0c3e2fefd7a245d3ed.jpg',
        },
        {
            id: 102,
            name: 'Karim Mia & Team',
            skill: 'Harvesting Group',
            price: '3000৳/day',
            location: 'Rajshahi',
            rating: 4.9,
            experience: '10 Years',
            image: 'https://i.pinimg.com/736x/91/ac/57/91ac5704e2eda1ab1f504c7b03a9e455.jpg',
        },
        {
            id: 103,
            name: 'Sumi Akter',
            skill: 'Vegetable Picking',
            price: '500৳/day',
            location: 'Bogura',
            rating: 4.6,
            experience: '3 Years',
            image: 'https://i.pinimg.com/736x/c2/02/b8/c202b854cbd37bb206b79b6b0bdf481d.jpg',
        },
        {
            id: 104,
            name: 'Abdul Malek',
            skill: 'Soil Preparation',
            price: '550৳/day',
            location: 'Barisal',
            rating: 4.4,
            experience: '7 Years',
            image: 'https://i.pinimg.com/736x/8a/2d/db/8a2ddbfd3c842ca7a10d6868f33f0442.jpg',
        },
        {
            id: 105,
            name: 'Green Field Team',
            skill: 'Weeding Specialists',
            price: '1500৳/day',
            location: 'Tangail',
            rating: 4.7,
            experience: '4 Years',
            image: 'https://i.pinimg.com/736x/69/de/62/69de62b6c9655c6e03f8a4471d343e75.jpg',
        },
        {
            id: 106,
            name: 'Jahangir Alam',
            skill: 'Fertilizer Application',
            price: '700৳/day',
            location: 'Comilla',
            rating: 4.8,
            experience: '12 Years',
            image: 'https://i.pinimg.com/736x/10/77/bb/1077bb7781f5b4b7bda8108ed507789d.jpg',
        },
        {
            id: 107,
            name: 'Layla Begum',
            skill: 'Fruit Grading',
            price: '450৳/day',
            location: 'Natore',
            rating: 4.5,
            experience: '6 Years',
            image: 'https://i.pinimg.com/736x/c4/4c/43/c44c439162557a3ce5a323a55a9160f5.jpg',
        },
        {
            id: 108,
            name: 'Rashid & Sons',
            skill: 'Irrigation Management',
            price: '800৳/day',
            location: 'Satkhira',
            rating: 4.6,
            experience: '15 Years',
            image: 'https://i.pinimg.com/736x/99/34/83/993483a424f0d78babf56b451e177b9f.jpg',
        }
    ];

    const allItems = [...machines, ...laborers];


    const isBooked = (id) => {
        return bookedItems.some(booking => booking.itemId === id);
    };


    const rawData = activeTab === 'machines' ? machines : laborers;
    
    const displayData = rawData.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const typeOrSkill = activeTab === 'machines' ? item.type : item.skill;
        
        return (
            item.name.toLowerCase().includes(searchLower) ||
            item.location.toLowerCase().includes(searchLower) ||
            typeOrSkill.toLowerCase().includes(searchLower)
        );
    });


    const openModal = (item) => {

        if ((!item.available && activeTab === 'machines') || isBooked(item.id)) return;
        
        setSelectedItem(item);
        setBookingStep('form');
        setFormData({ name: '', phone: '', date: '', duration: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadUserBookings = async () => {
        try {
            const response = await api.get(`/api/bookings/user/${user.uid}`);
            setBookedItems(response.data.bookings || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const bookingData = {
                userId: user.uid,
                userName: formData.name || user.displayName || 'User',
                userEmail: user.email || '',
                userPhone: formData.phone,
                itemId: selectedItem.id.toString(),
                itemName: selectedItem.name,
                itemType: activeTab === 'machines' ? selectedItem.type : selectedItem.skill,
                itemImage: selectedItem.image,
                price: selectedItem.price,
                bookingDate: formData.date,
                duration: formData.duration,
            };

            await api.post('/api/bookings', bookingData);
            
            // Reload bookings
            await loadUserBookings();

            setTimeout(() => {
                setBookingStep('success');
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
            setLoading(false);
        }
    };

    const getMyHiresList = () => {
        return bookedItems;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans relative">
            {/* Floating My Hires Button (bottom-right) */}
            <button
                onClick={() => setIsMyHiresOpen(true)}
                className="fixed bottom-5 right-5 bg-green-700 text-white pl-4 pr-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-xl z-40 hover:bg-green-800 transition transform hover:scale-105 active:scale-95"
                aria-label="Open my hires"
            >
                <span className="relative">
                    <FaClipboardList className="text-base" />
                    {bookedItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-secondary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                            {bookedItems.length}
                        </span>
                    )}
                </span>
                My Hires
            </button>

            <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white py-8 px-4 mb-6 rounded-b-3xl shadow-md relative">

                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight drop-shadow-sm">
                        Find Your Farming Force
                    </h1>
                    <p className="text-sm text-green-50 max-w-xl mx-auto">
                        Connect with top-rated machinery and skilled hands in your region.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

                    <div className="bg-white p-1 rounded-full shadow-sm border border-gray-100 inline-flex relative">
                        <button
                            onClick={() => setActiveTab('machines')}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                                activeTab === 'machines'
                                ? 'text-white bg-green-600 shadow'
                                : 'text-gray-500 hover:text-green-600 hover:bg-gray-50'
                            }`}
                        >
                            <FaTractor /> Machinery
                        </button>
                        <button
                            onClick={() => setActiveTab('labor')}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                                activeTab === 'labor'
                                ? 'text-white bg-green-600 shadow'
                                : 'text-gray-500 hover:text-green-600 hover:bg-gray-50'
                            }`}
                        >
                            <FaUserFriends /> Skilled Labor
                        </button>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <input
                            type="text"
                            placeholder={`Search for ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm group-focus-within:text-green-500 transition-colors" />
                        <button className="absolute right-2 top-1.5 p-1.5 bg-gray-100 rounded-full text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors">
                            <FaFilter className="text-xs" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {displayData.length > 0 ? (
                        displayData.map((item) => {
                            const booked = isBooked(item.id);
                            const unavailable = (activeTab === 'machines' && !item.available) || booked;

                            return (
                                <div 
                                    key={item.id} 
                                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    <div className="h-44 w-full relative overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${unavailable ? 'grayscale' : ''}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] font-bold shadow-sm flex items-center gap-1 text-gray-800">
                                            <FaStar className="text-yellow-400 text-[10px]" /> {item.rating}
                                        </div>

                                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm ${
                                            booked ? 'bg-blue-600' : (item.available ? 'bg-green-500' : 'bg-red-500')
                                        }`}>
                                            {booked ? 'Hired by You' : (item.available ? 'Available' : 'Booked')}
                                        </div>
                                    </div>

                                    <div className="p-3 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 leading-tight truncate">{item.name}</h3>
                                            <p className="text-[10px] text-green-600 font-semibold mb-1.5 uppercase tracking-wide">
                                                {activeTab === 'machines' ? item.type : item.skill}
                                            </p>

                                            <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                                                <FaMapMarkerAlt className="text-green-500 text-[10px]" /> {item.location}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-end mb-2 border-t pt-2 border-gray-100">
                                                <div>
                                                    <p className="text-[10px] text-gray-400">Rate</p>
                                                    <p className="text-base font-extrabold text-gray-900">{item.price}</p>
                                                </div>
                                                {activeTab === 'labor' && (
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-400">Experience</p>
                                                        <p className="text-xs font-medium text-gray-700">{item.experience}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => openModal(item)}
                                                disabled={unavailable}
                                                className={`w-full py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all duration-300
                                                    ${unavailable
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 active:scale-95'
                                                    }`}
                                            >
                                                {booked ? (
                                                    'Already Hired'
                                                ) : (activeTab === 'machines' && !item.available) ? (
                                                    'Unavailable'
                                                ) : (
                                                    <> <FaClock className="text-[10px]" /> Book Now </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <div className="text-gray-300 mb-4">
                                <FaSearch className="text-6xl mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-600">No matches found</h3>
                            <p className="text-gray-400">Try adjusting your search term.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Booking Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp relative">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10">
                            <FaTimes size={20} />
                        </button>

                        {bookingStep === 'form' ? (
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Booking</h2>
                                <p className="text-gray-500 mb-6 text-sm">
                                    You are booking <span className="font-bold text-green-600">{selectedItem?.name}</span> at {selectedItem?.price}.
                                </p>
                                <form onSubmit={handleConfirmBooking} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-3 top-3 text-gray-400 text-sm"/>
                                            <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="+880 1XXX NNNNN" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                            <div className="relative">
                                                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 text-sm"/>
                                                <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                            <input type="text" name="duration" required value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="e.g. 2 Days" />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className={`w-full mt-6 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Creating Booking...' : 'Confirm Request'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="p-10 flex flex-col items-center text-center animate-fadeIn">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <FaCheckCircle className="text-5xl text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Successfully Hired!</h2>
                                <p className="text-gray-500 mb-8 max-w-xs">
                                    Your request for <strong>{selectedItem?.name}</strong> has been placed.
                                </p>
                                <button onClick={closeModal} className="px-8 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors shadow-md">
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- My Hires Modal --- */}
            {isMyHiresOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-fadeInUp relative">
                        <div className="p-6 bg-green-600 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FaClipboardList /> My Hired Resources
                            </h2>
                            <button onClick={() => setIsMyHiresOpen(false)} className="text-white hover:text-red-200 transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            {bookedItems.length === 0 ? (
                                <div className="text-center text-gray-400 py-10">
                                    <p className="text-lg">You haven't hired anyone yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookedItems.map((booking, index) => (
                                        <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                                            <img src={booking.itemImage} alt={booking.itemName} className="w-16 h-16 rounded-lg object-cover mr-4" />
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-gray-800">{booking.itemName}</h3>
                                                <p className="text-sm text-green-600 font-medium">{booking.itemType}</p>
                                                <p className="text-xs text-gray-500">Booked for: {booking.date} ({booking.duration})</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-gray-900">{booking.price}</span>
                                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hire;