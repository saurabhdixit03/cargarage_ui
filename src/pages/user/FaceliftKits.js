import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAllFaceliftKits, checkUserSession } from '../../services/userService';
import UserNavbar from '../../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FaceliftKits = () => {
  const navigate = useNavigate();
  const [faceliftKits, setFaceliftKits] = useState([]);
  const [userName, setUserName] = useState("");
  const baseURL = "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await checkUserSession();
        if (!session || !session.authenticated) {
          navigate("/user/login");
          return;
        }
        setUserName(session.name || "User");
        toast.success(`Welcome back, ${session.name}!`, {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
        });
        const kits = await getAllFaceliftKits(session.userId);
        setFaceliftKits(kits || []);
      } catch (error) {
        toast('No Faceliftkit Available');
        console.error("Error fetching facelift kits:", error);
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
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container-fluid d-flex flex-column align-items-center py-4">
        <div className="d-flex justify-content-between w-100 px-4 mb-3">
          <div>
            <h2 className="text-white fw-bold">Available Facelift Kits</h2>
            <p className="text-white">Explore custom kits for your car model</p>
          </div>
          <div className="align-self-center">
            <Link to="/user/dashboard/kitbooking" className="btn btn-warning fw-semibold">
              View Bookings
            </Link>
          </div>
        </div>

        <div className="row g-4 justify-content-center" style={{ width: '90%' }}>
          {faceliftKits.length > 0 ? (
            faceliftKits.map((kit, index) => (
              <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={index}>
                <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-3">
                  {kit.images && kit.images.length > 0 ? (
                    <img
                      src={`${baseURL}${kit.images[0]}`}
                      alt={kit.kitName}
                      className="card-img-top rounded-3"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-secondary text-white rounded-3"
                      style={{ height: '200px' }}>
                      No Image Available
                    </div>
                  )}
                  <div className="card-body d-flex flex-column align-items-center">
                    <h5 className="fw-bold text-dark">{kit.carName}</h5>
                    <p><strong>Kit Name:</strong> {kit.kitName}</p>
                    <p><strong>Description:</strong> {kit.description || 'N/A'}</p>
                    <p className="text-success fw-bold">Price: ₹{kit.price}</p>
                    <Link
                      to="/user/dashboard/faceliftkitbooking"
                      state={{ kit }}
                      className="btn btn-primary mt-2"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No facelift kits available for your car.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceliftKits;
