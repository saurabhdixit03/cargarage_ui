import { Link, useNavigate } from "react-router-dom";
import UserNavbar from '../../components/UserNavbar';
import React, { useEffect, useState } from 'react';
import { getAllServices, getAllFaceliftKits, checkUserSession } from '../../services/userService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseURL = "http://localhost:8080"; // same as FaceliftKits.js


const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState("All");
  const [faceliftKits, setFaceliftKits] = useState([]);
  const [faceliftMessage, setFaceliftMessage] = useState("");
  const [userName, setUserName] = useState(user?.name || "Guest");

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

  useEffect(() => {
    if (category === "Facelift Kit") {
      fetchFaceliftKits();
    }
  }, [category]);

  const fetchFaceliftKits = async () => {
    try {
      const sessionResponse = await checkUserSession();
      if (sessionResponse.authenticated) {
        const data = await getAllFaceliftKits(sessionResponse.userId);
        if (data.length > 0) {
          setFaceliftKits(data);
          setFaceliftMessage("");
        } else {
          setFaceliftMessage("No facelift kits available for your car.");
        }
      }
    } catch (error) {
      console.error("Error fetching facelift kits:", error);
    }
  };

  const filteredServices = () => {
    switch (category) {
      case "New Car Protection":
        return services.filter(service => ["Paint Protection Films (PPF)", "Ceramic and Graphene Coating", "Custom Wrap", "Sound Damping"].includes(service.name));
      case "Old Car Modification":
        return services.filter(service => ["Body-shop (Denting & Painting)", "Custom Wrap", "Detailing & Interior Cleaning"].includes(service.name));
      case "Facelift Kit":
        return faceliftKits;
      case "All":
      default:
        return services;
    }
  };

  const renderServiceCard = (service) => {
  const isFacelift = category === "Facelift Kit";
  return (
    <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={service.id || service.kitName}>
      <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-3">
        <div className="card-body d-flex flex-column align-items-center">
          
          {/* 🔥 Show Image if it's a Facelift Kit */}
          {isFacelift && service.images && service.images.length > 0 ? (
            <img
              src={`${baseURL}${service.images[0]}`}
              alt={service.kitName}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "1rem",
              }}
            />
          ) : null}

          <h5 className="card-title fw-bold text-dark">{service.name || service.carName}</h5>
          <h6 className="fw-semibold text-secondary px-3">{service.kitName}</h6>

          <p className="fw-semibold text-secondary px-3">{service.description || service.kitDescription}</p>
          <p className="text-success fw-bold">Budget: ₹{service.budget || service.price}</p>
          {service.discount_percentage > 0 && (
            <p className="text-danger">Discount: {service.discount_percentage}%</p>
          )}
          {isFacelift ? (
            <Link
              to="/user/dashboard/faceliftkitbooking/"
              state={{ kit: service, isFaceliftKit: true }}
              className="btn btn-primary mt-2"
            >
              Book Facelift Kit
            </Link>
          ) : (
            <Link
              to="/user/dashboard/AppointmentBooking/"
              state={{ service }}
              className="btn btn-primary mt-2"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};


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
      <ToastContainer position="top-right" autoClose={1} />

      <div className="container py-3">
        <div className="btn-group d-flex justify-content-center" role="group">
          {["All", "New Car Protection", "Old Car Modification", "Facelift Kit"].map((cat) => (
            <button 
              key={cat} 
              className={`btn ${category === cat ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container-fluid d-flex flex-column align-items-center">
        <h2 className="text-center mb-4 fw-bold text-white">Welcome to Car Garage, {userName}</h2>
        <p className="text-center text-white">Select from our premium car services</p>
        <div className="row g-4 justify-content-center" style={{ width: '85%' }}>
          {category === "Facelift Kit" && faceliftMessage ? (
            <p className="text-white">{faceliftMessage}</p>
          ) : (
            filteredServices().length > 0 ? filteredServices().map(renderServiceCard) : (
              <p className="text-white">No services available at the moment.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
