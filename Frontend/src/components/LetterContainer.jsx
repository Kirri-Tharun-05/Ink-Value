
import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useParams } from "react-router-dom";

export const LetterContainer = () => {
    const { id: draftId } = useParams();
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [token, setToken] = useState();
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileName, setFileName] = useState("");
    // Load draft when component mounts
    useEffect(() => {
        if (draftId) {
            axios.get(`http://localhost:8080/api/drafts/${draftId}`, { withCredentials: true })
                .then(response => {
                    setContent(response.data.content);
                })
                .catch(error => {
                    console.error("Error fetching draft:", error);
                });
        }
        axios.get("http://localhost:8080/auth/token", { withCredentials: true })
            .then(response => {
                if (response.data.token) {
                    console.log('inside letterContainer logs : ', response.data);
                    setToken(response.data.token);
                }
            })
            .catch(error => {
                console.error("Failed to fetch token", error);
            });

        axios.get("http://localhost:8080/auth/user", { withCredentials: true })
            .then(response => {
                console.log("User info:", response.data);
                setUser(response.data);
            })
            .catch(error => console.error("Error fetching user:", error));
    }, [draftId]);

    // Save draft to localStorage
    const saveDraft = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/drafts/save",
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
            alert("Draft saved successfully!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving draft:", error.response?.data || error.message);
            alert("Failed to save draft.");
        }
    };


    // Upload file to Google Drive via backend
    const saveToDrive = async () => {
        if (!token) {
            alert("Please log in first.");
            return;
        }

        console.log("Saving to Google Drive with token:", token); // ✅ Debugging log

        try {
            const response = await axios.post(
                "http://localhost:8080/upload",
                { content, fileName: "MyLetter8.doc" },
                { withCredentials: true }
            );

            console.log("Response from server:", response.data); // ✅ Debugging log

            if (response.data.success) {
                alert(`File saved! File ID: ${response.data.fileId}`);
            } else {
                alert("Error saving file.");
            }
        } catch (error) {
            console.error("Error in saveToDrive:", error); // ✅ Logs any errors
            alert("Failed to save file.");
        }
    };
    const openModal = () => {
        setIsModalOpen(true);
    };

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
                <button onClick={openModal} className="historyBtn px-4 py-2 bg-blue-500 text-white rounded">
                    Save Draft
                </button>
                <button onClick={saveToDrive} className="historyBtn px-4 py-2 bg-green-500 text-white rounded">
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
                            <button onClick={saveDraft} className="px-4 py-2 bg-green-600 text-white rounded historyBtn">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
