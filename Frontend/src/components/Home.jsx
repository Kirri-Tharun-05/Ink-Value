import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import server from "../environment";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
const Home = () => {
  const navigate = useNavigate();
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
  }, []);
  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white" style={{ height: '85vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl px-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          "Writing is the painting of the voice." ✍️
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Capture your thoughts, edit your letters, and save them directly to Google Drive with ease.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg rounded-full shadow-lg transition-all"
          onClick={() => navigate('/text_edit')}>
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;