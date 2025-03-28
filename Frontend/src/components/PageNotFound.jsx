import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-gray-100" style={{height:'85vh'}}>
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">Oops! Page Not Found</h2>
      <p className="text-gray-500 mt-2">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link to="/home" className="mt-6 px-6 py-2 bg-blue-500 text-white text-lg rounded-lg shadow-md hover:bg-blue-600 transition">
        Go Back Home
      </Link>
    </div>
  );
};

export default PageNotFound;
