import axios from 'axios';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
// import videoCall from '../logos/videoCall.jpg';
// import { motion } from 'framer-motion';
// import { Hero } from './Landing_Page/Hero.jsx';
// import Features from './Landing_Page/Features.jsx';
import server from '../environment.js';
const Home = () => {
  useEffect(() => {
    // For google.signin
    if (!localStorage.getItem('googleMessage')) {
      axios.get(`${server}/auth/login/success`, { withCredentials: true })
        .then((response) => {
          toast.success(response.data.message);
          localStorage.setItem("googleMessage", true);
        })
        .catch((error) => {
          console.warn("Error:", error);
        });
    }

    // For Manual Sign in 
    const message = localStorage.getItem('flashMessage'); // ✅ Retrieve from localStorage
    if (message) {
      toast.success(message);
      localStorage.removeItem('flashMessage'); // ✅ Remove after showing
    }

  }, []);
  return (
    <div className="">
        <h1>Inside Home Page</h1>
    </div>
  )
}

export default Home;
