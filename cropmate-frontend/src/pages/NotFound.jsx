import React from 'react';
import { Link } from 'react-router';
import { FaSeedling } from 'react-icons/fa';

const NotFound = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-6">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 text-secondary mb-3">
        <FaSeedling className="text-2xl" />
      </div>
      <h1 className="text-4xl font-extrabold text-secondary mb-1">404</h1>
      <p className="text-base font-semibold text-secondary mb-1">Field not found</p>
      <p className="text-tertiary text-sm mb-5 max-w-sm mx-auto">
        The page you're looking for has been harvested or never existed.
      </p>
      <Link
        to="/"
        className="inline-block bg-primary text-secondary text-sm font-bold px-5 py-2 rounded-full hover:bg-primary/80 transition active:scale-95"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
