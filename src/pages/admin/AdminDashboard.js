import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    checkAdminSession,
    getAdminServices,
    getAdminCustomers,
    getAdminAppointments,
    getAdminCars,
    getAdminDiscounts,
    getFaceliftKits
} from '../../services/adminService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminDisplayName, setAdminName] = useState("");
    const [services, setServices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [cars, setCars] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [faceliftkits, setFaceliftkits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sessionResponse = await checkAdminSession();
                if (!sessionResponse || !sessionResponse.authenticated) {
                    navigate("/admin/login");
                    return;
                }

                const adminDisplayName = sessionResponse.name || "Admin";
                setAdminName(adminDisplayName);

                toast.success(`Welcome back, ${adminDisplayName}! `, {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                });

                const fetchFunctions = [
                    getAdminServices,
                    getAdminCustomers,
                    getAdminAppointments,
                    getAdminCars,
                    getAdminDiscounts,
                    getFaceliftKits
                ];

                const responses = await Promise.allSettled(fetchFunctions.map(fn => fn()));

                responses.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        switch (index) {
                            case 0: setServices(result.value || []); break;
                            case 1: setCustomers(result.value || []); break;
                            case 2: setAppointments(result.value || []); break;
                            case 3: setCars(result.value || []); break;
                            case 4: setDiscounts(result.value || []); break;
                            case 5: setFaceliftkits(result.value || []); break;
                            default: break;
                        }
                    } else {
                        console.error(`Error fetching data at index ${index}:`, result.reason);
                    }
                });
            } catch (error) {
                console.error("Unexpected error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, [navigate]);

    const renderCard = (title, description, count, link, icon) => (
        <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={title}>
            <Link to={`/admin/dashboard${link}`} className="text-decoration-none w-100">
                <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-3">
                    <div className="card-body d-flex flex-column align-items-center">
                        <div className="mb-3">
                            <i className={`bi ${icon} text-primary`} style={{ fontSize: '40px' }}></i>
                        </div>
                        <h5 className="card-title fw-bold text-dark">{title}</h5>
                        <p className="fw-semibold text-secondary px-3">{description}</p>
                        <p className="fw-bold text-success fs-4">{count ?? 0}</p>
                    </div>
                </div>
            </Link>
        </div>
    );

    return (
        <div style={{
            backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Navbar adminDisplayName={adminDisplayName} />
            <ToastContainer position="top-right" autoClose={30} />
            <div className="container-fluid d-flex flex-column align-items-center py-4">
                
                <h2 className="text-center mb-4 fw-bold text-white">CarGarage: Automotive Service Platform</h2>
                <p className="text-center text-white mb-4">Monitor and manage all operations at a glance</p>
                <div className="row g-4 justify-content-center" style={{ width: '85%' }}>
                    {renderCard('Services', 'Monitor and update all car services available for customers.', services.length, '/services', 'bi-gear')}
                    {renderCard('Facelift Kits', 'Monitor and update facelift kits.', faceliftkits.length, '/faceliftkits', 'bi-stars')}
                    {renderCard('Customers', 'Access and manage all registered customer details.', customers.length, '/customers', 'bi-people')}
                    {renderCard('Cars', 'Keep track of customer vehicles and their service records.', cars.length, '/cars', 'bi-car-front')}
                    {renderCard('Appointments', 'Manage, approve, or modify service appointments.', appointments.length, '/appointments', 'bi-calendar-check')}
                    {renderCard('Discounts & Packages', 'Create and oversee discounts and service packages.', discounts.length, '/discounts', 'bi-gift')}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
