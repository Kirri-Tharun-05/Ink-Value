// import React from 'react'
// import { useState, useRef } from 'react';
// import JoditEditor from 'jodit-react'



// export const LetterContainer = () => {

//     const editor = useRef(null);
//     const [content, setContent] = useState('');
//     return (
//         <div>
//             <h1 className='text-center text-4xl my-5'>Letter Editor</h1>
//             <JoditEditor
//                 ref={editor}
//                 value={content}
//                 onChange={newContent => { setContent(newContent) }}
//                 className='text-editor'
//             />
//             <h1>{content}</h1>
//         </div>
//     )
// }
import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";

export const LetterContainer = () => {
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [token, setToken] = useState();

    // Load draft when component mounts
    useEffect(() => {
        const savedDraft = localStorage.getItem("draftText");
        if (savedDraft) {
            setContent(savedDraft);
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
    }, []);

    // Save draft to localStorage
    const saveDraft = () => {
        localStorage.setItem("draftText", content);
        alert("Draft saved locally!");
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
                <button onClick={saveDraft} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Save Draft
                </button>
                <button onClick={saveToDrive} className="px-4 py-2 bg-green-500 text-white rounded">
                    Save to Google Drive
                </button>
            </div>
        </div>
    );
};
