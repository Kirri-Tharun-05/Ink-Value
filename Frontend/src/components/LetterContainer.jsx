import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import isAuth from "../utils/isAuth.jsx";
import { toast } from "react-toastify";

function LetterContainer() {
    const { id: draftId } = useParams();
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [token, setToken] = useState();
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileName, setFileName] = useState("");
    const [isSavingToDrive, setIsSavingToDrive] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    // Load draft when component mounts
    useEffect(() => {
        if (draftId) {
            axios.get(`https://ink-value-backend.onrender.com/api/drafts/${draftId}`, { withCredentials: true })
                .then(response => {
                    setContent(response.data.content);
                })
                .catch(error => {
                    console.error("Error fetching draft:", error);
                });
        }
        axios.get("https://ink-value-backend.onrender.com/auth/token", { withCredentials: true })
            .then(response => {
                if (response.data.token) {
                    console.log('inside letterContainer logs : ', response.data);
                    setToken(response.data.token);
                }
            })
            .catch(error => {
                console.error("Failed to fetch token", error);
            });

        axios.get("https://ink-value-backend.onrender.com/auth/user", { withCredentials: true })
            .then(response => {
                console.log("User info:", response.data);
                setUser(response.data);
            })
            .catch(error => console.error("Error fetching user:", error));
    }, [draftId]);

    // Save draft to localStorage
    const saveDraft = async () => {
        try {
            const response = await axios.post("https://ink-value-backend.onrender.com/api/drafts/save",
                {
                    userId: user._id,  // Get from authenticated user
                    title: fileName,
                    content: content, // Get from Jodit Editor
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });
            console.log("Draft saved:", response.data);
            toast.success("📂✨ File Successfully Saved to Drafts! 📝🚀");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving draft:", error.response?.data || error.message);
            toast.error("❌⚠️ Oops! Failed to Save File to Drafts. Please Try Again! 🔄");
        }
    };


    // Upload file to Google Drive via backend
    const saveToDrive = async () => {
        if (!token) {
            toast.error("Please log in first.");
            return;
        }
        setIsLoading(true);
        console.log("Saving to Google Drive with token:", token); // ✅ Debugging log

        try {
            const response = await axios.post(
                "https://ink-value-backend.onrender.com/upload",
                { content, fileName: fileName },
                { withCredentials: true }
            );

            console.log("Response from server:", response.data); // ✅ Debugging log

            if (response.data.success) {
                toast.success("✨🚀 Your File Has Been Successfully Saved to Google Drive! 📂✅");
            } else {
                toast.error("Error saving file.");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error in saveToDrive:", error); // ✅ Logs any errors
            toast.error("Failed to save file.");
        } finally {
            setIsLoading(false); // ✅ Hide loading after request completes
        }
    };
    const confirm = () => {
        setIsSavingToDrive(false);
        setIsModalOpen(true);
    };

    const confirmForDrive = () => {
        setIsSavingToDrive(true);
        setIsModalOpen(true);
    }
    // Close modal without saving
    const closeModal = () => {
        setIsModalOpen(false);
        setFileName(""); // Reset file name input
    };

    return (
        <div className="p-4">
            <h1 className="text-center text-4xl my-5">Letter Editor</h1>
            <JoditEditor
                ref={editor}
                value={content}
                onChange={(newContent) => setContent(newContent)}
                className="text-editor border p-2"
            />

            <div className="flex justify-center gap-4 mt-4">
                <button onClick={confirm} className="historyBtn px-4 py-2 bg-blue-500 text-white rounded">
                    Save Draft
                </button>
                <button onClick={confirmForDrive} className="historyBtn px-4 py-2 bg-green-500 text-white rounded">
                    Save to Google Drive
                </button>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-10 backdrop-blur-lg flex justify-center items-center text-black">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-xl font-semibold mb-4">Enter File Name</h2>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Enter file name..."
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal} className="px-4 py-2 bg-red-600 text-white rounded historyBtn">
                                Cancel
                            </button>
                            {
                                isSavingToDrive
                                    ? <button onClick={saveToDrive} className="px-4 py-2 bg-green-600 text-white rounded historyBtn">Save</button>
                                    : <button onClick={saveDraft} className="px-4 py-2 bg-green-600 text-white rounded historyBtn">Save</button>
                            }

                        </div>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-lg">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
                        <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
                        <p className="mt-4 text-lg font-semibold text-black">Saving to Google Drive...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default isAuth(LetterContainer);