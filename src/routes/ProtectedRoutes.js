import { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import {adminApiClient} from "../services/api"; // Ensure apiClient includes credentials

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApiClient.get("/session", { withCredentials: true })
            .then(response => {
                if (response.data.authenticated) {
                    setIsAuthenticated(true);
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p>Loading...</p>; // Prevent flicker
    }

    if (!isAuthenticated) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Access Denied</h2>
                <p>You must be logged in to view this page.</p>
                <Link to="/" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                    Go to Login
                </Link>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
