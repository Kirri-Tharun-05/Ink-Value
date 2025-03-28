import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import isAuth from "../utils/isAuth";
import server from "../environment";

const MyDrafts = () => {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState([]);
    const [confirm, setConfirm] = useState({ isOpen: false, draftId: null });

    useEffect(() => {
        axios.get(`${server}/api/drafts`, { withCredentials: true })
            .then((res) => {
                console.log("Fetched drafts:", res.data);
                setDrafts(res.data);
            })
            .catch((e) => console.log("Error fetching drafts:", e));
    }, []);

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const confirmation=(draftId)=>{
        setConfirm({isOpen:true,draftId});
    }
    const handleDelete = async (draftId) => {
        if (!confirm.draftId) return;

        try {
            await axios.delete(`${server}/api/drafts/delete/${draftId}`, { withCredentials: true });
            setDrafts(drafts.filter(draft => draft._id !== draftId));
            console.log(`Draft ${draftId} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting draft:", error);
        }
        setConfirm({ isOpen: false, draftId: null })
    };
    return (
        <div className="">
            <div className="history">
                <div className="bg-white p-6 rounded-2xl shadow-xl w-96  flex flex-col border-4 border-orange-600" style={{ maxHeight: '80%' }}>
                    <h2 className="text-xl font-semibold mb-4 text-black text-center">📝My Draft Files</h2>
                    <div className="historyList">
                        <ul className="space-y-3">
                            {drafts.map((draft, index) => (
                                <li key={index} className="p-2 bg-gray-100 rounded-md border-2 border-orange-600 historyListItem">
                                    <p className="text-black font-medium">Title : {draft.title}</p>
                                    <p className="text-black font-medium">Date : {formatDate(draft.createdAt)}</p>
                                    <div className="flex space-x-1">
                                        <button onClick={() => { navigate(`/text_edit/${draft._id}`) }} className="mt-4 px-4 py-2 text-white rounded-md w-full historyBtn text-2xl" style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }}>edit</button>
                                        <button onClick={() => confirmation(draft._id)} className="mt-4 px-4 py-2 text-white rounded-md w-full historyBtn text-2xl" style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }}>delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <button className="mt-4 px-4 py-2 text-white rounded-md w-full historyBtn text-2xl" style={{ background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)' }} onClick={() => navigate('/home')}>
                            Close
                        </button>
                    </div>
                </div>
                {confirm.isOpen && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80 border-2 border-red-600">
                        <h2 className="text-xl font-semibold mb-4 text-black text-center">❌ Confirm Delete</h2>
                        <p className="text-black text-center mb-4">Are you sure you want to delete this draft?</p>
                        <div className="flex justify-between">
                            <button  onClick={() => handleDelete(confirm.draftId)} className="px-4 py-2 bg-red-600 text-white rounded-md w-1/2 mr-2 historyBtn">Delete</button>
                            <button onClick={() => setDeleteModal({ isOpen: false, draftId: null })} className="px-4 py-2 bg-gray-300 text-black rounded-md w-1/2 historyBtn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

// export default isAuth(MyDrafts);
export default MyDrafts;