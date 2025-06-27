import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkUserSession, getUserCars, bookAppointment } from '../../services/userService';
import UserNavbar from '../../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DiscountBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDiscount = location.state?.discount || null;
  const selectedServiceIds = location.state?.serviceIds || [];

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [serviceIds, setServiceIds] = useState(selectedServiceIds);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkUserSession();
        if (!session || !session.authenticated) {
          navigate("/user/login");
          return;
        }
        setUserId(session.userId);
        setUserName(session.name || "User");
        toast.success(`Welcome back, ${session.name}! 🎉`, {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
        });
      } catch (error) {
        toast.error("Session expired. Please login again.");
        navigate("/user/login");
      }
    };
    verifySession();
  }, [navigate]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        if (!userId || !selectedDiscount?.id) return;
        const carData = await getUserCars(userId);
        setCars(carData || []);
      } catch (error) {
        toast.error("Error fetching cars.");
      }
    };
    fetchCars();
  }, [userId, selectedDiscount]);

  const handleBooking = async () => {
    if (!selectedCar || !appointmentDate) {
      toast.error("Please select a car and date.");
      return;
    }

    const payload = {
      userId,
      carId: selectedCar,
      appointmentDate,
      serviceIds: serviceIds.length > 0 ? serviceIds : [serviceIds],
      discountId: selectedDiscount?.id || null
    };

    try {
      await bookAppointment(userId, payload);
      toast.success("Discounted service booked successfully!");
      navigate('/user/dashboard/servicebookings');
    } catch (error) {
      toast.error("Failed to book discounted appointment.");
    }
  };

  return (
    <div style={{
        backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',

      backgroundColor: '#1c1c1e',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <UserNavbar userName={userName} />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-fluid d-flex flex-column align-items-center py-5">
        <h2 className="text-center mb-3 fw-bold text-white">Book Discounted Service</h2>
        <p className="text-center text-white mb-4">Enjoy exclusive savings on your next visit</p>
        <div className="card shadow-lg p-4 border-0 rounded-4 bg-light" style={{ maxWidth: '800px', width: '100%' }}>
          {selectedDiscount ? (
            <div className="mb-4 bg-light rounded-3 p-3 border">
              <p><strong>Offer:</strong> {selectedDiscount.name}</p>
              <p><strong>Discount:</strong> {selectedDiscount.discountPercentage}%</p>
              <p><strong>Services:</strong> {selectedDiscount.serviceNames?.join(', ') || "N/A"}</p>
            </div>
          ) : (
            <p className="text-danger text-center">No discount selected!</p>
          )}

          <div className="mb-4">
            <label className="fw-semibold mb-2">Select Your Car</label>
            <div className="d-flex overflow-auto">
              {cars.map(car => (
                <div
                  key={car.id}
                  className={`p-3 me-3 rounded-4 border text-center ${selectedCar === car.id ? 'bg-primary text-white' : 'bg-white'}`}
                  onClick={() => setSelectedCar(car.id)}
                  style={{
                    minWidth: '200px',  
                    cursor: 'pointer',
                    borderColor: selectedCar === car.id ? '#6c63ff' : '#dee2e6'
                  }}
                >
                  <h6>{car.make} {car.model}</h6>
                  <small className="d-block"> {car.licensePlate}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="fw-semibold mb-2">Select Appointment Date</label>
            <input
              type="date"
              className="form-control"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="text-center">
            <button
              className="btn btn-primary px-5 py-2 rounded-4 fw-semibold"
              onClick={handleBooking}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountBooking;
