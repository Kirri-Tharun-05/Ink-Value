# 🖊️InkValue (Letter📄Editor with Google Drive Integration)
## Live Demo : [Click Here For Live Demo](https://ink-value.onrender.com/home)
## 📌 Project Overview
The **Letter Editor with Google Drive Integration** is a full-stack web application that allows users to create, edit, and save letters using a rich text editor. Users can authenticate via **Google OAuth**, save drafts locally, and upload finalized letters to **Google Drive** in Google Docs format.

## 🚀 Features
- 🔑 **Google Sign-In (OAuth Authentication)**
- 📝 **Rich Text Editing** with **Jodit Editor**
- 💾 **Save Drafts Locally** before uploading
- ☁️ **Google Drive Integration** for storage
- 📄 **Upload letters as Google Docs** inside a dedicated `Letters` folder
- 🔍 **Retrieve & View Saved Letters** from Google Drive
- 🔐 **Secure Session Management** (JWT/Session-based authentication)
- 🚀 **Fully Responsive & Modern UI**

## 🛠 Tech Stack
### **Frontend**
- **React.js** (UI framework)
- **Tailwind CSS** (Styling)
- **Jodit Editor** (Text editor for letter creation)
- **React Router** (Navigation)
- **Framer Motion** (Animations)

### **Backend**
- **Node.js** (Runtime environment)
- **Express.js** (Backend framework)
- **Google OAuth (Passport.js)** (Authentication)
- **Google Drive API** (Letter storage & retrieval)
- **Axios** (HTTP requests)

### **Database**
- **MongoDB** (For storing drafts & user data)

### **Deployment**
- **Frontend**: Render 
- **Backend**: Render 
- **Database**: MongoDB Atlas

## ⚡ Installation & Setup
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/letter-editor-google-drive.git
   cd letter-editor-google-drive
   ```

2. **Set up environment variables** (`.env` file)
   ```env
   # Backend
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   MONGO_URI=your-mongodb-uri
   SESSION_SECRET=your-session-secret
   FRONTEND_URL=http://localhost:5173

   # Frontend
   VITE_BACKEND_URL=http://localhost:5000
   ```

3. **Install dependencies**
   - Frontend:
     ```sh
     cd frontend
     npm install
     npm run dev
     ```
   - Backend:
     ```sh
     cd backend
     npm install
     npm run dev
     ```

4. **Access the app**
   - Open `http://localhost:5173` in your browser.

## 📌 Usage Guide
1. **Sign in with Google** to authenticate.
2. **Create and edit letters** using the text editor.
3. **Save drafts locally** before finalizing.
4. **Upload letters to Google Drive** as Google Docs.
5. **Retrieve & view saved letters** anytime.

## 📜 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/auth/login/success` | Fetch logged-in user details |
| `POST` | `/auth/logout` | Logout user |
| `POST` | `/letters/save-draft` | Save letter draft to MongoDB |
| `POST` | `/letters/upload` | Upload letter to Google Drive |
| `GET`  | `/letters/list` | Retrieve saved letters from Google Drive |

## 🎯 Future Improvements
- ✨ **Collaborative Editing** with Google Docs API
- 🔄 **Auto-Sync Drafts** between local & cloud
- 📧 **Email Integration** to send letters directly

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo, make changes, and submit a pull request.

## 📜 License
This project is licensed under the MIT License.

## 📞 Contact
For queries or feedback, reach out via:
- **GitHub**: [Kirri-Tharun-05](https://github.com/Kirri-Tharun-05)
- **Email**: tharunprajitha2017@gmail.com
- **LinkedIn**: [Kirri-Tharun](https://www.linkedin.com/in/kirri-tharun/)

