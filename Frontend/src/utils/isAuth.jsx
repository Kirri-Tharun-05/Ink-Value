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
