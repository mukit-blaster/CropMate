import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaUsers, FaClipboardList, FaChartLine, FaSeedling,
  FaBug, FaCheckCircle, FaClock, FaTimes, FaSearch,
  FaEye, FaEdit, FaTrash, FaUserShield, FaBook, FaShoppingBag,
  FaArrowUp, FaArrowDown, FaFilter, FaBars, FaTimes as FaClose,
  FaSyncAlt
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import api from '../lib/api';
import { useNavigate } from 'react-router';

const REFRESH_INTERVAL_MS = 20000;

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [detections, setDetections] = useState([]);
  const [knowledgeTips, setKnowledgeTips] = useState([]);
  const [sellItems, setSellItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const isMountedRef = useRef(true);
  const inFlightRef = useRef(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.uid) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get(`/api/users/${user.uid}`);
        const role = response.data.user?.role;
        setUserRole(role);

        if (role !== 'admin') {
          alert(`Access denied. Admin only. Your role: ${role || 'user'}`);
          navigate('/');
          return;
        }

        await loadDashboardData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        alert(`Error verifying admin access: ${error.response?.data?.message || error.message}`);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, navigate]);

  // Mount/unmount tracker so async callbacks don't setState after unmount.
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const loadDashboardData = useCallback(async ({ silent = false } = {}) => {
    if (!user?.uid) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (!silent) setRefreshing(true);
    const loadStats = async () => {
      try {
        const statsRes = await api.get(`/api/admin/stats`, {
          params: { userId: user.uid }
        });
        if (statsRes.data && statsRes.data.stats) {
          setStats(statsRes.data.stats);
        } else {
          setStats(null);
        }
      } catch (error) {
        console.error('Error fetching stats:', error.response?.data || error.message);
        setStats(null);
      }
    };

    const loadUsers = async () => {
      try {
        const usersRes = await api.get(`/api/admin/users`, {
          params: { userId: user.uid, limit: 50 }
        });
        if (usersRes.data && usersRes.data.users) {
          setUsers(usersRes.data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
        setUsers([]);
      }
    };

    const loadBookings = async () => {
      try {
        const bookingsRes = await api.get(`/api/admin/bookings`, {
          params: { userId: user.uid, limit: 50 }
        });
        if (bookingsRes.data && bookingsRes.data.bookings) {
          setBookings(bookingsRes.data.bookings);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error.response?.data || error.message);
        setBookings([]);
      }
    };

    const loadPredictions = async () => {
      try {
        const predictionsRes = await api.get(`/api/admin/predictions`, {
          params: { userId: user.uid, limit: 50 }
        });
        if (predictionsRes.data && predictionsRes.data.predictions) {
          setPredictions(predictionsRes.data.predictions);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error.response?.data || error.message);
        setPredictions([]);
      }
    };

    const loadDetections = async () => {
      try {
        const detectionsRes = await api.get(`/api/admin/detections`, {
          params: { userId: user.uid, limit: 50 }
        });
        if (detectionsRes.data && detectionsRes.data.detections) {
          setDetections(detectionsRes.data.detections);
        } else {
          setDetections([]);
        }
      } catch (error) {
        console.error('Error fetching detections:', error.response?.data || error.message);
        setDetections([]);
      }
    };

    const loadKnowledgeTips = async () => {
      try {
        const knowledgeRes = await api.get(`/api/admin/knowledge`, {
          params: { userId: user.uid, limit: 50 }
        });
        if (knowledgeRes.data && knowledgeRes.data.tips) {
          setKnowledgeTips(knowledgeRes.data.tips);
        } else {
          setKnowledgeTips([]);
        }
      } catch (error) {
        console.error('Error fetching knowledge tips:', error.response?.data || error.message);
        setKnowledgeTips([]);
      }
    };

    const loadSellItems = async () => {
      try {
        const sellItemsRes = await api.get(`/api/admin/sell-items`, {
          params: { userId: user.uid, limit: 50 }
        });
        if (sellItemsRes.data && sellItemsRes.data.items) {
          setSellItems(sellItemsRes.data.items);
        } else {
          setSellItems([]);
        }
      } catch (error) {
        console.error('Error fetching sell items:', error.response?.data || error.message);
        setSellItems([]);
      }
    };

    try {
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadBookings(),
        loadPredictions(),
        loadDetections(),
        loadKnowledgeTips(),
        loadSellItems()
      ]);
      if (isMountedRef.current) setLastUpdated(new Date());
    } finally {
      inFlightRef.current = false;
      if (isMountedRef.current) setRefreshing(false);
    }
  }, [user?.uid]);

  // Real-time refresh: poll every REFRESH_INTERVAL_MS while autoRefresh is on
  // and the tab is visible. Also refresh when the tab regains focus.
  useEffect(() => {
    if (userRole !== 'admin' || !autoRefresh) return undefined;

    const tick = () => {
      if (document.visibilityState === 'visible') {
        loadDashboardData({ silent: true });
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadDashboardData({ silent: true });
      }
    };

    const id = setInterval(tick, REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [userRole, autoRefresh, loadDashboardData]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/bookings/${bookingId}`, { status: newStatus });
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/api/admin/users/${userId}/role`,
        { role: newRole },
        { params: { userId: user.uid } }
      );
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(`Failed to update user role: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null;
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'bookings', label: 'Bookings', icon: FaClipboardList },
    { id: 'predictions', label: 'Predictions', icon: FaSeedling },
    { id: 'detections', label: 'Detections', icon: FaBug },
    { id: 'knowledge', label: 'Knowledge', icon: FaBook },
    { id: 'sell-items', label: 'Sell Items', icon: FaShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <FaUserShield className="text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  Admin Dashboard
                </h1>
                <p className="text-green-100 text-[11px]">Manage your CropMate platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 mr-1">
                <button
                  onClick={() => loadDashboardData()}
                  disabled={refreshing}
                  title="Refresh now"
                  className={`p-2 rounded-full bg-white/20 hover:bg-white/30 transition ${refreshing ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <FaSyncAlt className={`text-xs ${refreshing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setAutoRefresh((v) => !v)}
                  title={autoRefresh ? 'Auto-refresh on (click to pause)' : 'Auto-refresh paused (click to resume)'}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${autoRefresh ? 'bg-green-500/30 border-green-300/40 text-white' : 'bg-white/10 border-white/20 text-white/70'}`}
                >
                  {autoRefresh ? 'LIVE' : 'PAUSED'}
                </button>
                <span className="text-[10px] text-green-100/80 hidden lg:inline">
                  {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-green-100">Welcome back,</p>
                <p className="text-xs font-semibold">{user?.displayName || user?.email}</p>
              </div>
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border-2 border-white/30"
                />
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-1.5"
            >
              {mobileMenuOpen ? <FaClose className="text-base" /> : <FaBars className="text-base" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile refresh bar */}
        <div className="md:hidden flex items-center justify-between mb-3 bg-white rounded-lg shadow-sm px-3 py-2 border border-gray-100">
          <span className="text-[11px] text-gray-500">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading…'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${autoRefresh ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
            >
              {autoRefresh ? 'LIVE' : 'PAUSED'}
            </button>
            <button
              onClick={() => loadDashboardData()}
              disabled={refreshing}
              className={`p-1.5 rounded-full bg-green-600 text-white ${refreshing ? 'opacity-60' : 'hover:bg-green-700'}`}
            >
              <FaSyncAlt className={`text-xs ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-blue-500 transform transition-all hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalUsers || 0}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <FaArrowUp className="text-green-500 text-xs" />
                      <p className="text-xs text-green-600 font-semibold">+{stats.recentUsers || 0} this week</p>
                    </div>
                  </div>
                  <div className="bg-blue-100 rounded-full p-2">
                    <FaUsers className="text-lg text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-green-500 transform transition-all hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalBookings || 0}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <FaArrowUp className="text-green-500 text-xs" />
                      <p className="text-xs text-green-600 font-semibold">+{stats.recentBookings || 0} this week</p>
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-full p-2">
                    <FaClipboardList className="text-lg text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-yellow-500 transform transition-all hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">Crop Predictions</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalPredictions || 0}</p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-2">
                    <FaSeedling className="text-lg text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-red-500 transform transition-all hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">Disease Detections</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalDetections || 0}</p>
                  </div>
                  <div className="bg-red-100 rounded-full p-2">
                    <FaBug className="text-lg text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-purple-500 transform transition-all hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">Knowledge Tips</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalKnowledgeTips || 0}</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-2">
                    <FaBook className="text-lg text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-indigo-500 transform transition-all hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">Sell Items</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalSellItems || 0}</p>
                  </div>
                  <div className="bg-indigo-100 rounded-full p-2">
                    <FaShoppingBag className="text-lg text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-3 border border-yellow-200">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-200 rounded-full p-3">
                    <FaClock className="text-base text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                    <p className="text-xl font-bold text-yellow-700">{stats.pendingBookings || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-3 border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="bg-green-200 rounded-full p-3">
                    <FaCheckCircle className="text-base text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Completed</p>
                    <p className="text-xl font-bold text-green-700">{stats.completedBookings || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <FaClock className="text-yellow-600" />
              <p className="text-yellow-800 font-medium">Loading statistics...</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Desktop Tabs */}
          <div className="hidden md:block border-b border-gray-200 bg-gray-50">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-3 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon /> {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden border-b border-gray-200 bg-gray-50 p-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none font-medium"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-base font-bold text-gray-800 mb-3">Platform Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                      <FaChartLine className="text-blue-600" /> Recent Activity
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <strong>{stats?.recentUsers || 0}</strong> new users this week
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <strong>{stats?.recentBookings || 0}</strong> new bookings this week
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <strong>{stats?.totalPredictions || 0}</strong> total crop predictions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <strong>{stats?.totalDetections || 0}</strong> total disease detections
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                      <FaClipboardList className="text-green-600" /> Booking Status
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Pending:
                        </span>
                        <strong className="text-yellow-700">{stats?.pendingBookings || 0}</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Confirmed:
                        </span>
                        <strong className="text-blue-700">{stats?.confirmedBookings || 0}</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Completed:
                        </span>
                        <strong className="text-green-700">{stats?.completedBookings || 0}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">All Users</h2>
                    <p className="text-sm text-gray-500 mt-1">Total: {users.length} users</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                      <tr>
                        <th className="px-4 py-4 font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Role</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden md:table-cell">Joined</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FaUsers className="text-4xl text-gray-300" />
                              <p className="text-gray-500 font-semibold">No users found</p>
                              <p className="text-sm text-gray-400">Users will appear here once they register</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        users
                          .filter(u => 
                            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((u) => {
                            const userId = u._id ? (typeof u._id === 'string' ? u._id : u._id.toString()) : u.uid;
                            return (
                              <tr key={userId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 font-medium">{u.name || 'N/A'}</td>
                                <td className="px-4 py-4 text-gray-600">{u.email}</td>
                                <td className="px-4 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {u.role || 'user'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-4 py-4">
                                  <select
                                    value={u.role || 'user'}
                                    onChange={(e) => updateUserRole(userId, e.target.value)}
                                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                                  >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-800">All Bookings</h2>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-full sm:w-64"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                      <tr>
                        <th className="px-4 py-4 font-semibold text-gray-700">Item</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden md:table-cell">User</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Type</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden lg:table-cell">Date</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FaClipboardList className="text-4xl text-gray-300" />
                              <p className="text-gray-500 font-semibold">No bookings found</p>
                              <p className="text-sm text-gray-400">Bookings will appear here when users make reservations</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((booking) => (
                          <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                {booking.itemImage && (
                                  <img src={booking.itemImage} alt={booking.itemName} className="w-12 h-12 rounded-lg object-cover" />
                                )}
                                <span className="font-medium">{booking.itemName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <div>
                                <p className="font-medium">{booking.userName}</p>
                                <p className="text-sm text-gray-500">{booking.userEmail}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                {booking.itemType}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm hidden lg:table-cell">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                                className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Predictions Tab */}
            {activeTab === 'predictions' && (
              <div>
                <h2 className="text-base font-bold text-gray-800 mb-3">Crop Predictions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                      <tr>
                        <th className="px-4 py-4 font-semibold text-gray-700">User</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Soil Type</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden md:table-cell">pH</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden md:table-cell">Temp</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden lg:table-cell">Humidity</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FaSeedling className="text-4xl text-gray-300" />
                              <p className="text-gray-500 font-semibold">No predictions found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        predictions.map((pred) => (
                          <tr key={pred._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">{pred.userName || pred.userEmail || 'N/A'}</td>
                            <td className="px-4 py-4">{pred.soilType}</td>
                            <td className="px-4 py-4 hidden md:table-cell">{pred.phLevel}</td>
                            <td className="px-4 py-4 hidden md:table-cell">{pred.temperature}Â°C</td>
                            <td className="px-4 py-4 hidden lg:table-cell">{pred.humidity}%</td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {new Date(pred.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Detections Tab */}
            {activeTab === 'detections' && (
              <div>
                <h2 className="text-base font-bold text-gray-800 mb-3">Disease Detections</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                      <tr>
                        <th className="px-4 py-4 font-semibold text-gray-700">User</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Image</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Analysis Preview</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden md:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detections.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FaBug className="text-4xl text-gray-300" />
                              <p className="text-gray-500 font-semibold">No detections found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        detections.map((det) => (
                          <tr key={det._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">{det.userName || det.userEmail || 'N/A'}</td>
                            <td className="px-4 py-4">
                              {det.imageUrl && (
                                <img src={det.imageUrl} alt="Detection" className="w-20 h-20 rounded-lg object-cover" />
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                                {det.analysis?.substring(0, 100)}...
                              </p>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                              {new Date(det.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Knowledge Tips Tab */}
            {activeTab === 'knowledge' && (
              <div>
                <h2 className="text-base font-bold text-gray-800 mb-3">Knowledge Tips</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                      <tr>
                        <th className="px-4 py-4 font-semibold text-gray-700">Image</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Title</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden md:table-cell">Category</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden lg:table-cell">Date</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden lg:table-cell">Read Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {knowledgeTips.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FaBook className="text-4xl text-gray-300" />
                              <p className="text-gray-500 font-semibold">No knowledge tips found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        knowledgeTips.map((tip) => (
                          <tr key={tip._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              {tip.image && (
                                <img src={tip.image} alt={tip.title} className="w-20 h-20 rounded-lg object-cover" />
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <p className="font-medium">{tip.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{tip.short}</p>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                {tip.category}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">{tip.date}</td>
                            <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">{tip.readTime}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sell Items Tab */}
            {activeTab === 'sell-items' && (
              <div>
                <h2 className="text-base font-bold text-gray-800 mb-3">Sell Items</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                      <tr>
                        <th className="px-4 py-4 font-semibold text-gray-700">Image</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden md:table-cell">Type</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Price</th>
                        <th className="px-4 py-4 font-semibold text-gray-700 hidden lg:table-cell">Location</th>
                        <th className="px-4 py-4 font-semibold text-gray-700">Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellItems.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FaShoppingBag className="text-4xl text-gray-300" />
                              <p className="text-gray-500 font-semibold">No sell items found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        sellItems.map((item) => (
                          <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.itemType}</p>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {item.type}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-semibold">{item.price}</td>
                            <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">{item.location}</td>
                            <td className="px-4 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {item.available ? 'Available' : 'Out of Stock'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

