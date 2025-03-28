// require('dotenv').config();
// const { google } = require('googleapis');
// const fs = require('fs');
// const path = require('path');

// const express =require('express');
// const app= express();
// const session= require('express-session');
// const cors= require('cors');
// const passport=require('passport');
// const LocalStrategy = require('passport-local');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const sessionConfig=require('./src/config/sessionConfig.js');
// const passportSetup = require('./src/config/passport.js');  // always important to require this file while working with google authentication 
// const connectDB=require('./src/config/dbConfig.js');
// const authRoute=require('./src/routes/authRoutes.js');
// const User = require('./src/models/user');
// const PORT=8080;
// const flash = require('connect-flash');
// const cookieParser = require("cookie-parser"); 
// connectDB();
// // app.set('trust proxy',1);  // enable during production 
// app.use(cors({
//     origin:process.env.FRONTEND_URL,
//     credentials:true
// }));

// app.use(express.json()); // used to parse JSON data
// app.use(express.urlencoded({extended:true})); // used to parse data from the URL
// app.use(session(sessionConfig));
// app.use(flash());
// app.use(cookieParser());


// app.use(passport.initialize()); //Initializes Passport.js for authentication.
// app.use(passport.session()); // Enables session-based authentication
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use("/auth",authRoute);


// app.get('/home',(req,res)=>{
//     res.send('On Home Route');
// })

// app.get("/auth/token", (req, res) => {
//     console.log(req.cookies) // ✅ Read token from cookie
//     const token = req.cookies.token;
//     if (!token) {
//         return res.status(401).json({ error: "No token found" });
//     }
//     res.json({ token });
// });
// app.post('/upload', async (req, res) => {
//     try {
//         // ✅ Ensure user is authenticated
//         if (!req.isAuthenticated() || !req.user) {
//             return res.status(401).json({ error: "User not authenticated" });
//         }

//         const { content, fileName } = req.body;  // Receive content & filename from frontend
//         const accessToken = req.user.accessToken;  // ✅ Get the user's access token

//         // ✅ Check if the user has a valid access token
//         if (!accessToken) {
//             return res.status(403).json({ error: "Google Drive access token missing" });
//         }

//         // ✅ Initialize Google Drive API
//         const oauth2Client = new google.auth.OAuth2();
//         oauth2Client.setCredentials({ access_token: accessToken });
//         const drive = google.drive({ version: 'v3', auth: oauth2Client });

//         // ✅ Upload file logic here...
//     } catch (error) {
//         console.error("File Upload Error:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// });



// app.listen(PORT,()=>{
//     console.log(`Listening To Port ${PORT}`);
// })


require('dotenv').config();
const { google } = require('googleapis');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/dbConfig.js');
const sessionConfig = require('./src/config/sessionConfig.js');
const passportSetup = require('./src/config/passport.js'); // Always important for Google Auth
const authRoute = require('./src/routes/authRoutes.js');
const User = require('./src/models/user');
const draftRoute=require('./src/routes/draftRoutes.js');

const PORT = 8080;

// ✅ Connect to the database
connectDB();

// ✅ CORS Setup
app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// ✅ Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());
app.use(cookieParser());

// ✅ Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Routes
app.use("/auth", authRoute);
app.use("/api/drafts", draftRoute);
// ✅ Home Route
app.get('/home', (req, res) => {
    res.send('On Home Route');
});

// ✅ Get Auth Token Route (Check if token exists in cookies)
app.get("/auth/token", (req, res) => {
    console.log(req.cookies); // Debugging
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token found" });
    }
    res.json({ token });
});


app.post('/upload', async (req, res) => {
    try {
        // 🔒 Ensure user is authenticated
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { content, fileName } = req.body;
        const accessToken = req.user.accessToken;

        if (!accessToken) {
            return res.status(403).json({ error: "Google Drive access token missing" });
        }

        // ✅ Initialize OAuth Client with credentials
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
        oauth2Client.setCredentials({ access_token: accessToken });

        // ✅ Validate Token
        let tokenInfo;
        try {
            tokenInfo = await oauth2Client.getTokenInfo(accessToken);
        } catch (tokenError) {
            console.error('🚨 Token validation failed:', tokenError.message);
            return res.status(403).json({ error: "Invalid or expired Google token. Please re-authenticate." });
        }

        console.log('🔍 Token Scopes:', tokenInfo.scopes);
        if (!tokenInfo.scopes.includes('https://www.googleapis.com/auth/drive.file')) {
            return res.status(403).json({ error: "Invalid Google Drive permissions. Re-authenticate!" });
        }

        // ✅ Initialize Google Drive API
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // ✅ Check if "Letters" folder exists, create if not
        const folderQuery = "name='Letters' and mimeType='application/vnd.google-apps.folder' and 'me' in owners";
        const folderRes = await drive.files.list({ q: folderQuery, fields: 'files(id)' });

        let folderId = folderRes.data.files.length ? folderRes.data.files[0].id : null;
        if (!folderId) {
            console.log('📂 Creating "Letters" folder...');
            const folder = await drive.files.create({
                resource: { name: 'Letters', mimeType: 'application/vnd.google-apps.folder' },
                fields: 'id',
            });
            folderId = folder.data.id;
        }

        // ✅ Upload File
        console.log(`📤 Uploading file: ${fileName} to folder ID: ${folderId}`);
        // const fileMetadata = { name: fileName, parents: [folderId] };
        // const media = { mimeType: 'text/html', body: content };
        const fileMetadata = {
            name: fileName,
            mimeType: 'application/vnd.google-apps.document', // ✅ Convert to Google Docs
            parents: [folderId]
        };

        const media = {
            mimeType: 'text/html',  // ✅ Sending HTML content
            body: content
        };
        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        console.log('✅ File Uploaded Successfully, ID:', file.data.id);
        res.json({ success: true, fileId: file.data.id });

    } catch (error) {
        console.error("❌ File Upload Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});


// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
