import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const menuRef = useRef(null);

  const { user, logout } = useAuth();

  // Check user role
  useEffect(() => {
    const checkUserRole = async () => {
      if (user?.uid) {
        try {
          const response = await axios.get(`${API_URL}/api/users/${user.uid}`);
          setUserRole(response.data.user?.role);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUserRole(null);
      }
    };
    checkUserRole();
  }, [user]);

  const activeClass =
    "bg-primary text-secondary font-semibold rounded-lg px-3 py-1";

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeClass : "")}
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/coverage"
          className={({ isActive }) => (isActive ? activeClass : "")}
        >
          Coverage
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/hire"
          className={({ isActive }) => (isActive ? activeClass : "")}
        >
          Hire
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/predict"
          className={({ isActive }) => (isActive ? activeClass : "")}
        >
          Predict Crop
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/disease-detect"
          className={({ isActive }) => (isActive ? activeClass : "")}
        >
          Find Disease
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/knowledge"
          className={({ isActive }) => (isActive ? activeClass : "")}
        >
          Knowledge
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/sell"
          className={({ isActive }) => (isActive ? activeClass : "")}
        >
          Marketplace
        </NavLink>
      </li>
    </>
  );

  const handleLogout = () => {
    logout()
      .then(() => setShowMenu(false))
      .catch((error) => console.log(error));
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm mb-5 relative rounded-2xl mx-2 mt-2 px-4">
      {/* Left */}
      <div className="navbar-start">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="btn btn-ghost lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {open && (
          <ul className="menu bg-base-100 rounded-box absolute top-16 left-3 shadow w-52 p-2 z-50 lg:hidden">
            {links}
          </ul>
        )}

        {/* Brand Logo */}
        <Link to="/">
          <Logo />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-2">{links}</ul>
      </div>

      {/* Right */}
      <div className="navbar-end relative">
        {user ? (
          <div
            ref={menuRef}
            className="relative cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border-2 border-primary object-cover"
            />

            {/* Dropdown Menu */}
            {showMenu && (
              <ul className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-40 p-2 z-50 border">
                <li className="px-2 py-1 text-gray-700 font-medium">
                  {user?.displayName || "User"}
                </li>
                {userRole === 'admin' && (
                  <li>
                    <Link
                      to="/admin"
                      onClick={() => setShowMenu(false)}
                      className="block w-full text-left text-green-600 hover:bg-gray-100 px-2 py-1 rounded font-semibold"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-primary rounded-2xl text-secondary"
          >
            LogIn
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
