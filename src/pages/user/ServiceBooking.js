import React, { useState, useEffect } from 'react';
import { getUserAppointments, checkUserSession } from '../../services/userService';
import UserNavbar from '../../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const ServiceBookings = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const sessionResponse = await checkUserSession();
        if (!sessionResponse || !sessionResponse.authenticated) {
          navigate("/user/login");
          return;
        }

        setUserName(sessionResponse.name || "User");
        setUserEmail(sessionResponse.email || "");
        

        const response = await getUserAppointments();
        setAppointments(response || []);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
        toast.error('Unable to load appointments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [navigate]);

  const groupAppointments = (appointments) => {
    const grouped = {};
    appointments.forEach((appointment) => {
      const car = appointment.carModel;
      const date = appointment.appointmentDate;
      if (!grouped[car]) grouped[car] = {};
      if (!grouped[car][date]) grouped[car][date] = [];
      grouped[car][date].push(appointment);
    });
    return grouped;
  };

  const groupedAppointments = groupAppointments(appointments);

  const handlePayment = async (totalAmount) => {
    try {
      if (!totalAmount || !userEmail || !userName) {
        toast.error("Missing required payment data.");
        return;
      }

      navigate("/user/dashboard/payment", {
        state: {
          amount: totalAmount,
          email: userEmail,
          name: userName
        }
      });
    } catch (error) {
      console.error("Error initiating payment", error);
      toast.error("Failed to redirect for payment.");
    }
  };

  return (
    <div style={{ backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', display: 'flex', flexDirection: 'column' }}>
      <UserNavbar userName={userName} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header & Button Row */}
      <div className="container-fluid d-flex justify-content-between align-items-center py-4 px-5">
        <h2 className="fw-bold text-white m-0">My Service Bookings</h2>
        <Link
          to="/user/dashboard/kitBooking"
          className="btn btn-info btn-sm"
          style={{ textDecoration: 'none', fontWeight: 'bold' }}
        >
           Facelift Kit Bookings
        </Link>
      </div>

      {/* Subtitle */}
      <p className="text-center text-white mb-4">Review your appointments</p>

      {isLoading ? (
        <div className="text-white mt-4 text-center">Loading your appointments...</div>
      ) : Object.keys(groupedAppointments).length > 0 ? (
        <div className="row g-4 justify-content-center" style={{ width: '85%', margin: '0 auto' }}>
          {Object.entries(groupedAppointments).map(([carModel, byDate]) =>
            Object.entries(byDate).map(([appointmentDate, group]) => {
              const totalBudget = group.reduce((sum, appt) => sum + (appt.budget || 0), 0);
              return (
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={`${carModel}-${appointmentDate}`}>
                  <div className="card shadow-lg border-0 rounded-4 bg-light w-100 h-100 p-3 d-flex flex-column">
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold text-primary">{carModel} ({group[0].licensePlate})</h5>
                      <p className="fw-semibold text-dark">Appointment Date: {appointmentDate}</p>
                      <ul className="px-3">
                        {group.map((appointment, index) => (
                          <li key={index} className="text-secondary">
                            {appointment.serviceName} - ₹{appointment.budget || 0}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2">
                        <strong>Status: </strong>
                        <span className={`badge rounded-pill 
                          ${group[0].status === 'Accepted' ? 'bg-success' :
                            group[0].status === 'Canceled' ? 'bg-secondary' :
                              group[0].status === 'Rejected' ? 'bg-danger' :
                                'bg-warning text-dark'}`}>
                          {group[0].status}
                        </span>
                      </p>
                      <h5 className="fw-bold text-primary">Total Budget: ₹ {totalBudget}</h5>

                      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handlePayment(totalBudget)}
                        >
                          Pay Now
                        </button>

                        <Link
                          to={`/user/dashboard/AppointmentRescheduling`}
                          state={{
                            groupId: group[0].groupId,
                            carModel,
                            licensePlate: group[0].licensePlate,
                            appointmentDate,
                            selectedServices: group.map((appointment) => ({
                              id: appointment.serviceId,
                              name: appointment.serviceName,
                            })),
                            carId: group[0].carId
                          }}
                          className="btn btn-warning btn-sm"
                        >
                          Reschedule
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="text-white mt-4 text-center">You have no bookings yet.</div>
      )}
    </div>
  );
};

export default ServiceBookings;
