import { Link, useNavigate } from "react-router-dom";
import UserNavbar from '../../components/UserNavbar';
import React, { useEffect, useState } from 'react';
import { getAllServices, checkUserSession } from '../../services/userService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BrowseService = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await checkUserSession();
        if (!sessionResponse || !sessionResponse.authenticated) {
          navigate("/user/login");
          return;
        }
        setUserName(sessionResponse.name || "User");
        toast.success(`Welcome back, ${sessionResponse.name}! `, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        const servicesData = await getAllServices();
        setServices(servicesData || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchData();
  }, [navigate]);

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
      <UserNavbar userName={userName} />
      <ToastContainer position="top-right" autoClose={30} />
      <div className="container-fluid d-flex flex-column align-items-center">
        <h2 className="text-center mb-4 fw-bold text-white">Browse All Services</h2>
        <p className="text-center text-white">Explore our premium car services</p>
        <div className="row g-4 justify-content-center" style={{ width: '85%' }}>
          {services.length > 0 ? services.map(service => (
            <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={service.id}>
              <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-3">
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title fw-bold text-dark">{service.name}</h5>
                  <p className="fw-semibold text-secondary px-3">{service.description}</p>
                  <p className="text-success fw-bold">Budget: ₹{service.budget}</p>
                  {service.discount_percentage > 0 && (
                    <p className="text-danger">Discount: {service.discount_percentage}%</p>
                  )}
                  <Link to={`/user/dashboard/AppointmentBooking/`} state={{ service }} className="btn btn-primary">Book Now</Link>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-white">No services available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseService;
