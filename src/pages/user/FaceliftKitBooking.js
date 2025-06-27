import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookFaceliftKit, checkUserSession } from '../../services/userService';
import { ToastContainer, toast } from 'react-toastify';
import UserNavbar from '../../components/UserNavbar';
import 'react-toastify/dist/ReactToastify.css';
import globalStyles from '../../styles/globalstyles';

const FaceliftKitBooking = () => {
  const { state } = useLocation();
  const { kit } = state || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dropOffDate: '',
    pickUpDate: '',
  });
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!kit) {
        toast.error("No kit data found, redirecting...");
        navigate("/user/dashboard/faceliftkits");
        return;
      }
      const session = await checkUserSession();
      if (!session || !session.authenticated) {
        navigate("/user/login");
        return;
      }
      setUserId(session.userId);
      setUserName(session.name || "User");
    };
    init();
  }, [kit, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async () => {
    if (!formData.dropOffDate || !formData.pickUpDate) {
      toast.error("Select both drop-off and pick-up dates");
      return;
    }
    try {
      await bookFaceliftKit(userId, {
        carId: kit.carId,
        faceliftKitId: kit.faceliftKitId,
        dropOffDate: formData.dropOffDate,
        pickUpDate: formData.pickUpDate,
      });
      toast.success("Booking successful!");
      navigate("/user/dashboard/kitbooking");
    } catch (err) {
      toast.error("Booking failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div style={globalStyles.page}>
      <UserNavbar userName={userName} />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div style={globalStyles.container}>
        <div style={globalStyles.card} className="text-center mx-auto" >
          <h3 style={globalStyles.header}>{kit.kitName}</h3>
          
          {kit.images && kit.images.length > 0 && (
            <img
              src={`http://localhost:8080${kit.images[0]}`}
              alt={kit.kitName}
              style={globalStyles.image}
            />
          )}
          
          <p><strong>Car Model:</strong> {kit.carName}</p>
          <p><strong>Description:</strong> {kit.description || "N/A"}</p>
          <p style={{ color: "green", fontWeight: "700", fontSize: '1.25rem' }}>
            Price: ₹{kit.price}
          </p>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Drop-Off Date</label>
            <input
              type="date"
              name="dropOffDate"
              className="form-control"
              value={formData.dropOffDate}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-start">
            <label className="form-label fw-semibold">Pick-Up Date</label>
            <input
              type="date"
              name="pickUpDate"
              className="form-control"
              value={formData.pickUpDate}
              onChange={handleChange}
            />
          </div>
          <button
            style={globalStyles.bookBtn}
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceliftKitBooking;
