import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  checkUserSession,
  getUserAppointments,
  getUserFaceliftKitBookings,
  createPaymentOrder
} from '../../services/userService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNavbar from '../../components/UserNavbar';
import { connectWebSocket, disconnectWebSocket } from '../../services/websocketService';

const MyBookings = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [kitBookings, setKitBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await checkUserSession();
        if (!session || !session.authenticated) {
          navigate('/user/login');
          return;
        }
        setUserName(session.name || 'User');
        setUserEmail(session.email || '');

        toast.success(`Welcome back, ${session.name}!`, {
          position: 'top-right',
          autoClose: 1000,
          theme: 'dark',
        });

        const apptData = await getUserAppointments();
        const kitData = await getUserFaceliftKitBookings(session.userId);

        setAppointments(apptData || []);
        setKitBookings(kitData || []);
      } catch (error) {
        toast.error('Something went wrong while loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleStatusUpdate = (update) => {
      setKitBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === update.bookingId
            ? { ...booking, bookingStatus: update.newStatus }
            : booking
        )
      );
    };
    connectWebSocket(handleStatusUpdate);

    return () => disconnectWebSocket();
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

  const getProgress = (status) => {
    switch (status) {
      case 'CAR_RECEIVED': return 10;
      case 'CAR_REACHED_GARAGE': return 25;
      case 'UNDER_SERVICE': return 45;
      case 'KIT_APPLIED': return 65;
      case 'READY_TO_DELIVER': return 85;
      case 'DELIVERED': return 100;
      default: return 0;
    }
  };

  const formatStatusText = (status) => status?.split('_').join(' ') || 'Unknown';

  const getBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-success';
      case 'READY_TO_DELIVER': return 'bg-info text-dark';
      case 'KIT_APPLIED': return 'bg-primary';
      case 'UNDER_SERVICE': return 'bg-warning text-dark';
      case 'CAR_REACHED_GARAGE': return 'bg-secondary';
      case 'CAR_RECEIVED': return 'bg-dark text-light';
      default: return 'bg-light text-dark';
    }
  };

  const handlePayNow = async (appointment) => {
    try {
      const orderData = {
        amount: appointment.budget,
        currency: "INR",
        appointmentId: appointment.groupId,
        customerEmail: userEmail,
      };

      const order = await createPaymentOrder(orderData);

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'CarGarage',
        description: 'Service Payment',
        handler: async () => toast.success("Payment Successful"),
        prefill: { email: userEmail, name: userName },
        theme: { color: '#007bff' }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      toast.error("Payment initiation failed");
    }
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(to right, #1f4037, #99f2c8)',
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <UserNavbar userName={userName} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container-fluid py-4">
        <div className="row g-4">
          {/* Service Bookings */}
          <div className="col-md-6">
            <h3 className="text-white text-center mb-3">My Service Bookings</h3>
            {isLoading ? <p className="text-white">Loading...</p> :
              Object.keys(groupedAppointments).length === 0 ? <p className="text-white">No bookings found.</p> :
                Object.entries(groupedAppointments).map(([carModel, byDate]) =>
                  Object.entries(byDate).map(([appointmentDate, group]) => {
                    const totalBudget = group.reduce((sum, appt) => sum + (appt.budget || 0), 0);
                    return (
                      <div className="card shadow bg-light rounded-4 p-3 mb-4" key={`${carModel}-${appointmentDate}`}>
                        <h5 className="fw-bold">{carModel} ({group[0].licensePlate})</h5>
                        <p className="mb-1"><strong>Date:</strong> {appointmentDate}</p>
                        <ul>
                          {group.map((a, i) => (
                            <li key={i}>{a.serviceName} - ₹{a.budget}</li>
                          ))}
                        </ul>
                        <p>Status: <span className={`badge ${group[0].status === 'Accepted' ? 'bg-success' : 'bg-warning text-dark'}`}>{group[0].status}</span></p>
                        <p><strong>Total Budget:</strong> ₹{totalBudget}</p>
                        <div className="d-flex flex-wrap gap-2">
                          <Link to={`/user/dashboard/AppointmentRescheduling`} state={{
                            groupId: group[0].groupId,
                            carModel,
                            licensePlate: group[0].licensePlate,
                            appointmentDate,
                            selectedServices: group.map(appt => ({ id: appt.serviceId, name: appt.serviceName })),
                            carId: group[0].carId
                          }} className="btn btn-warning btn-sm">
                            Reschedule
                          </Link>
                          {group[0].paymentStatus !== 'PAID' && (
                            <button className="btn btn-success btn-sm" onClick={() => handlePayNow(group[0])}>Pay Now</button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
          </div>

          {/* Kit Bookings */}
          <div className="col-md-6">
            <h3 className="text-white text-center mb-3">My Kit Bookings</h3>
            {kitBookings.length === 0 ? <p className="text-white">No kit bookings found.</p> : (
              kitBookings.map((booking, index) => (
                <div className="card shadow bg-white rounded-4 p-3 mb-4" key={index}>
                  {booking.images?.[0] && (
                    <img src={`http://localhost:8080${booking.images[0]}`} alt="Kit" style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }} />
                  )}
                  <h5 className="fw-bold">{booking.kitName}</h5>
                  <p><strong>Car:</strong> {booking.carModel}</p>
                  <p><strong>Drop-Off:</strong> {booking.dropOffDate}</p>
                  <p><strong>Pick-Up:</strong> {booking.pickUpDate}</p>
                  <p><strong>Price:</strong> ₹{booking.price}</p>
                  <span className={`badge ${getBadgeClass(booking.bookingStatus)}`}>{formatStatusText(booking.bookingStatus)}</span>
                  <div className="progress mt-2" style={{ height: '10px' }}>
                    <div className="progress-bar" style={{ width: `${getProgress(booking.bookingStatus)}%`, backgroundColor: '#007bff' }} role="progressbar"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
