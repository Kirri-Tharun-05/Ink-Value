import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

const isAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate();
        const isAuthenticated = localStorage.getItem("googleMessage") !== null;

        useEffect(() => {
            if (!isAuthenticated) {
                window.location.href = `${server}/auth/google`; // Redirect to Google Auth
            }
        }, [isAuthenticated]);

        return isAuthenticated ? <WrappedComponent {...props} /> : null;
    };
    
    return AuthComponent;
};

export default isAuth;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import server from "../environment";

// const isAuth = (WrappedComponent) => {
//     const AuthComponent = (props) => {
//         const navigate = useNavigate();
//         const [isAuthenticated, setIsAuthenticated] = useState(false);

//         useEffect(() => {
//             const checkAuth = async () => {
//                 try {
//                     const response = await axios.get(`${server}/auth/user`, {
//                         withCredentials: true // Important! Sends cookies with request
//                     });

//                     if (response.data.authenticated) {
//                         setIsAuthenticated(true);
//                     } else {
//                         window.location.href = `${server}/auth/google`; // Redirect to Google Auth
//                     }
//                 } catch (error) {
//                     console.error("Authentication check failed", error);
//                     window.location.href = `${server}/auth/google`; // Redirect if not authenticated
//                 }
//             };

//             checkAuth();
//         }, []);

//         return isAuthenticated ? <WrappedComponent {...props} /> : null;
//     };

//     return AuthComponent;
// };

// export default isAuth;
