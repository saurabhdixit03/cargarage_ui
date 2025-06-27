import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getUserCars,
  getAllServices,
  bookAppointment,
  checkUserSession,
  getUserDiscounts,
  getUserAppointments
} from '../../services/userService';
import UserNavbar from '../../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const selectedService = location.state?.service || null;
  const [services, setServices] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState([]);
  const [discountId, setDiscountId] = useState(null);
  const [existingAppointments, setExistingAppointments] = useState([]);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const sessionData = await checkUserSession();
        if (sessionData?.authenticated) {
          setUserId(sessionData.userId);
          setUserName(sessionData.name || "User");
          toast.success(`Welcome, ${sessionData.name}!`, {
            position: "top-right",
            autoClose: 1500,
            theme: "dark",
          });
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

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const carData = await getUserCars(userId);
        setCars(carData);

        const serviceData = await getAllServices();
        const filteredServices = selectedService
          ? serviceData.filter(service => service.id !== selectedService.id)
          : serviceData;
        setServices(filteredServices);

        const appointments = await getUserAppointments(userId);
        setExistingAppointments(appointments || []);

        if (selectedService?.id) {
          const discount = await getUserDiscounts(userId, selectedService.id);
          if (discount?.id) setDiscountId(discount.id);
        }
      } catch (err) {
        toast.error("Error loading data");
      }
    };
    fetchData();
  }, [userId, selectedService]);

  const isDateAlreadyBooked = (date) => {
    return existingAppointments.some(app => app.appointmentDate === date);
  };

  const isDateInPast = (date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // strip time
    return selected < today;
  };

  const handleBooking = async () => {
    if (!selectedCar || !appointmentDate) {
      toast.error("Please select a car and date.");
      return;
    }

    if (isDateInPast(appointmentDate)) {
      toast.error("You cannot book an appointment for a past date."); // 🔥 NEW
      return;
    }

    if (isDateAlreadyBooked(appointmentDate)) {
      toast.error("You already have an appointment on this date.");
      return;
    }

    const appointmentData = {
      serviceIds: [selectedService?.id, ...selectedAdditionalServices].filter(Boolean),
      carId: selectedCar,
      appointmentDate,
      discountId: discountId || null
    };

    try {
      await bookAppointment(userId, appointmentData);
      toast.success("Appointment booked successfully!");
      navigate("/user/dashboard/servicebookings");
    } catch (err) {
      toast.error("Failed to book appointment.");
    }
  };

  const toggleService = (serviceId) => {
    setSelectedAdditionalServices(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const todayDateString = new Date().toISOString().split('T')[0]; // 🔥 NEW

  return (
    <div style={{
      backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      backgroundColor: '#0c0c0c',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <UserNavbar userName={userName} />
      <ToastContainer />
      <div className="container py-5 text-white">
        <h2 className="text-center mb-4 fw-bold text-white">Book Appointment</h2>
        <p className="text-center text-light mb-4">Choose your car, preferred services, and date</p>

        {/* Car Selection */}
        <div className="mb-5">
          <h5 className="fw-semibold mb-3">Select Your Car</h5>
          <div className="d-flex overflow-auto gap-3 pb-2">
            {cars.map(car => (
              <div
                key={car.id}
                className={`p-3 rounded-4 border text-center shadow-sm ${selectedCar === car.id ? 'bg-light text-dark border-primary' : 'bg-white text-dark'}`}
                style={{ minWidth: 200, cursor: 'pointer' }}
                onClick={() => setSelectedCar(car.id)}
              >
                <h6 className="fw-bold">{car.make} {car.model}</h6>
                <p className="text-muted mb-0">{car.licensePlate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Date and Selected Service */}
        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <div className="p-3 rounded-4 bg-white text-dark shadow-sm">
              <label className="form-label fw-semibold">Appointment Date</label>
              <input
                type="date"
                className="form-control"
                min={todayDateString} // 🔥 NEW
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="p-3 rounded-4 bg-white text-dark shadow-sm h-100 d-flex flex-column justify-content-center">
              <label className="form-label fw-semibold">Selected Service</label>
              <p className="fw-bold text-primary mb-0">{selectedService?.name || 'No service selected'}</p>
              {selectedService?.budget && (
                <p className="fw-semibold text-success mb-0">₹{selectedService.budget}</p>
              )}
              {selectedService?.discount_percentage > 0 && (
                <p className="text-danger mb-0">Discount: {selectedService.discount_percentage}%</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="mb-4">
          <h5 className="fw-semibold mb-3">Additional Services</h5>
          <div className="row g-4">
            {services.map(service => (
              <div key={service.id} className="col-md-4 col-sm-6">
                <div
                  className={`card shadow-sm p-3 h-100 rounded-4 ${selectedAdditionalServices.includes(service.id) ? 'border-primary bg-light' : 'bg-white'}`}
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
          <button className="btn btn-primary px-5 py-2 fw-bold rounded-pill" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
