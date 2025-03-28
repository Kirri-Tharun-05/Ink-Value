import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import server from './environment';
import logo from './logos/logo-transparent3.png'
import glogo from './logos/google_logo.png'
const Navbar = () => {
  const [currUser, setCurrUser] = useState(null);
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

  const handleHistory = () => {
    navigate('/my_draft_files');
  }

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
      <nav className='sticky top-0 py-6 lg :py-4 sm:py-5 border-b border-neutral-700/80 z-1 backdrop-blur-md'>
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <div className='flex items-center'>
              <a className='text-2xl' href='/home'><img src={logo} alt="" style={{ height: '4rem' }} /></a>
            </div>
            <div className="lg:flex justify-center space-x-10 items-center">
              {!currUser ? (
                  <button className='px-3 py-3 rounded-lg bg-gradient-to-r  tracking-wide text-1xl border-white fon border-2 ' onClick={() => window.location.href = `${server}/auth/google`}><img src={glogo} alt="" className='w-8 inline mx-2' />Sign in with Google</button>
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
      </nav >
    </>
  )
}

export default Navbar