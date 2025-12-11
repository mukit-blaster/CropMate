import React, { useState, useEffect } from "react";
import {
  FaSeedling,
  FaPills,
  FaSearch,
  FaFilter,
  FaStar,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaTimes,
  FaCheckCircle,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Sell = () => {
  const [activeTab, setActiveTab] = useState("medicine");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMyCartOpen, setIsMyCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState("form");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cropmate_cart")) || [];
    setCartItems(savedCart);
    fetchItems();
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const type = activeTab === "medicine" ? "medicine" : "seeds";
      const response = await axios.get(`${API_URL}/api/sell`, {
        params: { type, search: searchTerm || undefined }
      });
      if (response.data && response.data.items) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching sell items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm]);

  //==============================
  // LOGIC
  //==============================
  const filteredData = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.itemType.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term)
    );
  });

  // PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const isInCart = (id) => {
    return cartItems.some((c) => c.itemId === id);
  };

  //==============================
  // HANDLERS
  //==============================
  const openModal = (item) => {
    if (!item.available || isInCart(item._id || item.id)) return;
    setSelectedItem(item);
    setQuantity(1);
    setStep("form");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const addToCart = (e) => {
    e.preventDefault();
    const newItem = {
      itemId: selectedItem._id || selectedItem.id,
      name: selectedItem.name,
      type: selectedItem.itemType,
      price: selectedItem.price,
      quantity: quantity,
      image: selectedItem.image,
      location: selectedItem.location,
      addedAt: new Date().toISOString(),
    };
    const updated = [...cartItems, newItem];
    setCartItems(updated);
    localStorage.setItem("cropmate_cart", JSON.stringify(updated));
    setStep("success");
  };

  // REMOVE FUNCTION
  const removeFromCart = (itemId) => {
    const updated = cartItems.filter((item) => item.itemId !== itemId);
    setCartItems(updated);
    localStorage.setItem("cropmate_cart", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner text-success text-6xl mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsMyCartOpen(true)}
        className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold shadow-lg z-50 hover:bg-green-700 transition transform hover:scale-105"
      >
        <FaShoppingCart /> My Cart ({cartItems.length})
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white py-16 px-4 rounded-b-[3rem] shadow-xl mb-10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-md">
            Crop Essentials Marketplace
          </h1>
          <p className="text-lg md:text-xl text-green-50 max-w-3xl mx-auto">
            Find high-quality seeds and trusted crop medicines — all in one
            platform.
          </p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Tabs */}
          <div className="inline-flex bg-white shadow-md p-1.5 rounded-full border">
            <button
              onClick={() => {
                setActiveTab("medicine");
                fetchItems();
              }}
              className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
                activeTab === "medicine"
                  ? "bg-green-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaPills /> Medicine
            </button>
            <button
              onClick={() => {
                setActiveTab("seeds");
                fetchItems();
              }}
              className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
                activeTab === "seeds"
                  ? "bg-green-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaSeedling /> Seeds
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full py-3 pl-12 pr-4 border rounded-full shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-3 text-gray-400" />
            <button className="absolute right-4 top-2 p-2 bg-gray-100 rounded-full hover:bg-green-100 transition">
              <FaFilter />
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 min-h-[500px]">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <h3 className="text-xl">No items found matching your search.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {currentItems.map((item) => {
              const added = isInCart(item._id || item.id);
              const unavailable = !item.available || added;

              return (
                <div
                  key={item._id || item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border transition-all duration-300"
                >
                  <div className="h-64 relative group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        unavailable ? "grayscale opacity-80" : ""
                      }`}
                    />
                    {/* Status */}
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 text-xs rounded-full font-bold text-white shadow-sm ${
                        added
                          ? "bg-blue-600"
                          : item.available
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {added
                        ? "Added to Cart"
                        : item.available
                        ? "Available"
                        : "Out of Stock"}
                    </span>
                    {/* Rating */}
                    <span className="absolute top-4 right-4 bg-white px-3 py-1 text-sm rounded-lg font-bold shadow flex items-center gap-1">
                      <FaStar className="text-yellow-400" /> {item.rating || 0}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg truncate text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-green-600 font-semibold text-xs tracking-wide uppercase mb-2">
                      {item.itemType}
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <FaMapMarkerAlt className="text-green-600" />{" "}
                      {item.location}
                    </div>

                    <div className="flex justify-between items-center border-t pt-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {item.price}
                      </p>
                    </div>

                    <button
                      onClick={() => openModal(item)}
                      disabled={unavailable}
                      className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition-all shadow-md ${
                        unavailable
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5"
                      }`}
                    >
                      {added ? "Already in Cart" : "View & Add"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-12 flex justify-center items-center gap-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-4 rounded-full border shadow-sm transition-all ${
              currentPage === 1
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-white text-green-600 hover:bg-green-600 hover:text-white hover:shadow-md"
            }`}
          >
            <FaChevronLeft size={20} />
          </button>

          <span className="font-bold text-gray-600 text-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-4 rounded-full border shadow-sm transition-all ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-white text-green-600 hover:bg-green-600 hover:text-white hover:shadow-md"
            }`}
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Add to Cart Modal (With Description) */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes size={22} />
            </button>

            {step === "form" ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Product Details
                </h2>
                <div className="flex items-start gap-4 mb-6 bg-green-50 p-4 rounded-xl border border-green-100">
                  <img
                    src={selectedItem.image}
                    className="w-20 h-20 rounded-lg object-cover shadow-sm"
                    alt=""
                  />
                  <div>
                    <p className="font-bold text-lg text-gray-900 leading-tight mb-1">
                      {selectedItem?.name}
                    </p>
                    <p className="text-green-700 font-bold mb-2">
                      {selectedItem?.price}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded w-fit">
                      <FaStar /> {selectedItem?.rating || 0}
                    </div>
                  </div>
                </div>

                {/* Description Section Added Here */}
                {selectedItem.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                      <FaInfoCircle className="text-green-600" /> Description
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border">
                      {selectedItem?.description}
                    </p>
                  </div>
                )}

                <form onSubmit={addToCart} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">
                      Quantity (Packets/Bottles)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition font-bold text-lg text-center"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg text-lg"
                  >
                    Add to Cart
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center p-6">
                <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Added to Cart!</h2>
                <p className="text-gray-500 mb-8">
                  Item has been successfully added to your shopping cart.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={closeModal}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      closeModal();
                      setIsMyCartOpen(true);
                    }}
                    className="w-full bg-green-100 text-green-700 py-3 rounded-xl font-bold hover:bg-green-200 transition"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Cart Modal */}
      {isMyCartOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slideUp">
            <div className="bg-green-600 text-white p-6 flex justify-between items-center shadow-md z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaShoppingCart /> My Cart
              </h2>
              <button
                onClick={() => setIsMyCartOpen(false)}
                className="hover:text-red-200 transition bg-green-700 p-2 rounded-full"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="bg-gray-200 p-6 rounded-full mb-4">
                    <FaShoppingCart size={40} className="text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">Your cart is empty.</p>
                  <button
                    onClick={() => setIsMyCartOpen(false)}
                    className="mt-4 text-green-600 font-bold hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((c) => (
                    <div
                      key={c.itemId}
                      className="flex items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-20 h-20 rounded-lg mr-5 object-cover border"
                      />

                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {c.name}
                        </h3>
                        <p className="text-green-600 text-xs font-bold uppercase tracking-wide mb-1">
                          {c.type}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Quantity:{" "}
                          <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                            {c.quantity}
                          </span>
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end justify-between h-full gap-4">
                        <p className="font-bold text-xl text-green-700">
                          {c.price}
                        </p>
                        <button
                          onClick={() => removeFromCart(c.itemId)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition text-sm font-medium"
                        >
                          <FaTrash size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-medium">Total Items</span>
                  <span className="font-bold text-2xl text-gray-800">
                    {cartItems.length}
                  </span>
                </div>
                <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg text-lg tracking-wide">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sell;

