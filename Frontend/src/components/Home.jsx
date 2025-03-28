import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import server from "../environment";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("googleMessage")) {
      axios
        .get(`${server}/auth/login/success`, { withCredentials: true })
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
    <div className="w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white h-[85vh] px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
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
            onClick={() => navigate("/text_edit")}
          >
            Get Started
          </motion.button>
        </motion.div>
      </section>

      {/* How It Works & Key Features (Scroll Animations) */}
      <section className="flex flex-col md:flex-row items-center justify-center  text-white min-h-[80vh] px-6 gap-6">
        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 text-center bg-white text-gray-800 p-6 md:p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">🚀 How It Works</h2>
          <div className="text-base md:text-lg space-y-3 md:space-y-4">
            <p>1️⃣ <strong>Sign in with Google</strong> to access your Drive securely.</p>
            <p>2️⃣ <strong>Use the text editor</strong> to write and edit your letters.</p>
            <p>3️⃣ <strong>Save drafts locally</strong> before finalizing.</p>
            <p>4️⃣ <strong>Upload letters to Google Drive</strong> for easy access and sharing.</p>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 text-center bg-white text-gray-800 p-6 md:p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">✨ Key Features</h2>
          <ul className="text-base md:text-lg space-y-3 md:space-y-4">
            <li>✅ <strong>Google Sign-In</strong> for secure authentication</li>
            <li>✅ <strong>Rich Text Editing</strong> with formatting options</li>
            <li>✅ <strong>Auto-save drafts</strong> locally before uploading</li>
            <li>✅ <strong>Google Drive Integration</strong> for cloud storage</li>
            <li>✅ <strong>Access & Edit Letters</strong> anytime from Google Drive</li>
          </ul>
        </motion.div>
      </section>

      {/* Call-to-Action (Scroll Animation) */}
      <section className="flex flex-col items-center justify-center  text-white h-[90vh] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold mb-4">📌 Ready to Start Writing?</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg rounded-full shadow-lg transition-all"
            onClick={() => navigate("/text_edit")}
          >
            Start Writing Now 🚀
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
