import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getAllServices,
  rescheduleAppointment,
  checkUserSession
} from '../../services/userService';
import UserNavbar from '../../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentRescheduling = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const { groupId, carModel, licensePlate, appointmentDate, carId } = location.state || {};
    
  const [services, setServices] = useState([]);
  const [appointmentDateState, setAppointmentDate] = useState(appointmentDate || '');
  const [selectedServiceIds, setSelectedServices] = useState([]);

  const todayDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Handle session validation
  useEffect(() => {
    const verifySession = async () => {
      try {
        const sessionData = await checkUserSession();
        if (sessionData?.authenticated) {
          setUserId(sessionData.userId);
          setUserName(sessionData.name || "User");
        } else {
          navigate("/user/login");
        }
      } catch (err) {
        toast.error("Session expired. Please log in again.");
        navigate("/user/login");
      }
    };
    verifySession();
  }, [navigate]);

  // Fetch services once user is logged in
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const serviceData = await getAllServices();
        setServices(serviceData);
      } catch (err) {
        toast.error("Error loading services.");
      }
    };
    fetchData();
  }, [userId]);

  // Handle service toggle (select/deselect)
  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  // Handle appointment reschedule
  const handleReschedule = async () => {
    if (!appointmentDateState || selectedServiceIds.length === 0) {
      toast.error("Please select a date and at least one service.");
      return;
    }

    const selectedDate = new Date(appointmentDateState);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // normalize current date

    if (selectedDate < currentDate) {
      toast.error("Cannot choose a past date for the appointment.");
      return;
    }

    if (!carId) {
      toast.error("Missing car information. Cannot reschedule.");
      return;
    }

    const rescheduleData = {
      appointmentDate: appointmentDateState,
      serviceIds: selectedServiceIds,
    };

    try {
      console.log("Rescheduling for carId:", carId);
      await rescheduleAppointment(carId, rescheduleData);
      toast.success("Appointment Rescheduled successfully!");
      navigate("/user/dashboard/servicebookings");
    } catch (err) {
      toast.error("This appointment has already been accepted and can't be rescheduled.");
    }
  };

  return (
    <div style={{ backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UserNavbar userName={userName} />
      <ToastContainer />
      <div className="container py-5 text-white">
        <h2 className="text-center mb-4 fw-bold text-white">Reschedule Appointment</h2>
        <p className="text-center text-light mb-4">Update your car, services, or appointment date</p>

        {/* Display Selected Car */}
        <div className="mb-5">
          <h5 className="fw-semibold mb-3">Selected Car</h5>
          <div className="d-flex overflow-auto gap-3 pb-2">
            <div className="p-3 rounded-4 border text-center shadow-sm bg-light text-dark">
              <h6 className="fw-bold">{carModel}</h6>
              <p className="text-muted mb-0">{licensePlate}</p>
            </div>
          </div>
        </div>

        {/* Appointment Date */}
        <div className="mb-5">
          <label className="form-label fw-semibold">Appointment Date</label>
          <input
            type="date"
            className="form-control"
            min={todayDate}
            value={appointmentDateState}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </div>

        {/* Services */}
        <div className="mb-4">
          <h5 className="fw-semibold mb-3">Select Services</h5>
          <div className="row g-4">
            {services.map(service => (
              <div key={service.id} className="col-md-4 col-sm-6">
                <div
                  className={`card shadow-sm p-3 h-100 rounded-4 ${selectedServiceIds.includes(service.id) ? 'border-primary bg-light' : 'bg-white'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleService(service.id)}
                >
                  <h6 className="fw-bold">{service.name}</h6>
                  <p className="fw-semibold text-success mb-0">₹{service.budget}</p>
                  {service.discount_percentage > 0 && (
                    <p className="text-danger">Discount: {service.discount_percentage}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button className="btn btn-warning px-5 py-2 fw-bold rounded-pill" onClick={handleReschedule}>
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRescheduling;
