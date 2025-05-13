import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginRequiredModal from "../../pages/auth/LoginRequiredModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { isAdmin } from "../../utils/auth";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, user, isAppLoading } = useSelector((state) => state.account);
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (!isAuthenticated && !isAppLoading) {
            setIsModalOpen(true);
        }
        setCheckingAuth(false);
    }, [isAuthenticated, isAppLoading]);

    useEffect(() => {
        if (!isAppLoading && isAuthenticated) {
            if (isAdmin(user) && !location.pathname.startsWith("/admin")) {
                navigate("/admin/dashboard", { replace: true });
            } else if (!isAdmin(user) && location.pathname.startsWith("/admin")) {
                navigate("/", { replace: true });
            }
        }
    }, [isAuthenticated, isAppLoading, user, location.pathname, navigate]);

    const handleOk = () => {
        setIsModalOpen(false);
        navigate("/login", { state: { from: location.pathname }, replace: true });
    };

    if (isAppLoading || checkingAuth) {
        return <LoadingSpinner />;
    }

    return isAuthenticated ? (children) : (<LoginRequiredModal isOpen={isModalOpen} onConfirm={handleOk} />);
};

export default PrivateRoute;
