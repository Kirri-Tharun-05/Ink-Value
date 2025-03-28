import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import server from './environment';
import logo from './logos/logo-transparent3.png'
import glogo from './logos/google_logo.png'
const Navbar = () => {
  const [currUser, setCurrUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${server}/auth/user`, {
        withCredentials: true // ✅ Required for cookies
      });
      console.log('inside Navbar.hsx : ', res);
      setCurrUser(res.data); // ✅ Set user state
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.warn("User not authenticated");
        setCurrUser(null); // ✅ Make sure to set user as null
      } else {
        console.error("Error fetching user:", error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    window.addEventListener("userLoggedIn", fetchUser);
    return () => window.removeEventListener("userLoggedIn", fetchUser);
  }, []);

  const handleLogout = async () => {
    try {
      let result = await axios.get(`${server}/auth/logout`, { withCredentials: true }); // Inform backend
      localStorage.removeItem("googleMessage"); // Remove stored message
      toast.success(result.data.message);
      setCurrUser(null);
      navigate('/home');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <>
      {/* <nav className='sticky top-0 py-6 lg :py-4 sm:py-5 border-b border-neutral-700/80 z-1 backdrop-blur-md'>
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <div className='flex items-center'>
              <a className='text-2xl' href='/home'><img src={logo} alt="" style={{ height: '4rem' }} className='site-logo'/></a>
            </div>
            <div className="lg:flex justify-center space-x-10 items-center">
              {!currUser ? (
                  <button className='px-3 py-3 rounded-lg bg-gradient-to-r  tracking-wide text-1xl border-white fon border-2 signin-btn' onClick={() => window.location.href = `${server}/auth/google`}><img src={glogo} alt="" className='w-8 inline mx-2' />Sign in with Google</button>
              ) : (
                <>
                <button onClick={()=>navigate('/my_draft_files')} className=" px-4 py-2 text-white rounded-md historyBtn text-xl w-auto whitespace-nowrap" style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }}>My Draft</button>
                <button onClick={handleLogout} className=" px-4 py-2 text-white rounded-md w-full historyBtn text-xl" style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }}>LogOut</button>
                 </>
              )
              }
            </div>
          </div>
        </div>
      </nav > */}
       <nav className='sticky top-0 py-6 lg:py-4 sm:py-5 border-b border-neutral-700/80 z-10 backdrop-blur-md bg-opacity-90'> {/* ✅ UPDATED: z-index for mobile */}
      <div className="container px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href='/home' className='text-2xl'>
          <img src={logo} alt="Logo" style={{ height: '4rem' }} className='site-logo' />
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-10 items-center"> {/* ✅ UPDATED: Only visible on large screens */}
          {!currUser ? (
            <button 
              className='px-3 py-3 rounded-lg bg-gradient-to-r border-white border-2 signin-btn text-white flex items-center'
              onClick={() => window.location.href = `${server}/auth/google`}
            >
              <img src={glogo} alt="Google Logo" className='w-8 inline mx-2' />
              Sign in with Google
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/my_draft_files')}
                className="px-4 py-2 text-white rounded-md text-xl"
                style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }}
              >
                My Draft
              </button>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-white rounded-md text-xl"
                style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }}
              >
                LogOut
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }} 
            className="lg:hidden absolute top-20 left-0 w-full bg-neutral-900 p-5 text-center shadow-lg -z-0"
          >
            {!currUser ? (
              <button 
                className='px-3 py-3 rounded-lg bg-gradient-to-r border-white border-2 signin-btn text-white flex items-center justify-center w-full'
                onClick={() => window.location.href = `${server}/auth/google`}
              >
                <img src={glogo} alt="Google Logo" className='w-8 inline mx-2' />
                Sign in with Google
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/my_draft_files')}
                  className="block w-full py-2 my-2 text-white rounded-md text-lg"
                  style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }}
                >
                  My Draft
                </button>
                <button 
                  onClick={handleLogout} 
                  className="block w-full py-2 my-2 text-white rounded-md text-lg"
                  style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }}
                >
                  LogOut
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  )
}

export default Navbar