import React, { useEffect, useState } from 'react';
import { getUserFaceliftKitBookings, checkUserSession } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connectWebSocket, disconnectWebSocket } from '../../services/websocketService';

const steps = [
  { key: 'CAR_RECEIVED', label: 'Car Picked Up', emoji: '🚗' },
  { key: 'CAR_REACHED_GARAGE', label: 'Reached Garage', emoji: '🏁' },
  { key: 'UNDER_SERVICE', label: 'Under Service', emoji: '🔧' },
  { key: 'KIT_APPLIED', label: 'Kit Applied', emoji: '✨' },
  { key: 'READY_TO_DELIVER', label: 'Ready to Deliver', emoji: '📦' },
  { key: 'DELIVERED', label: 'Delivered', emoji: '🏠' },
];

const statusMessages = {
  CAR_RECEIVED: "We’ve picked up your car from you and started prepping it.",
  CAR_REACHED_GARAGE: "Your car has arrived at the garage and is waiting for service.",
  UNDER_SERVICE: "Our experts are installing the facelift kit on your car.",
  KIT_APPLIED: "The facelift kit has been applied. Final touches in progress.",
  READY_TO_DELIVER: "Your car is ready and will be returned to you soon.",
  DELIVERED: "Your car has been returned. Enjoy the facelift!",
  DEFAULT: "Status update pending."
};

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

const KitBookings = () => {
  const [kitBookings, setKitBookings] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const session = await checkUserSession();
        if (!session || !session.authenticated) {
          navigate("/user/login");
          return;
        }
        setUserName(session.name || 'User');
        const response = await getUserFaceliftKitBookings(session.userId);
        setKitBookings(response || []);
      } catch (error) {
        console.error("Failed to load kit bookings:", error);
        toast.error("Could not load kit bookings.");
      }
    };

    fetchBookings();

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

  // returns index of current step to highlight progress
  const getCurrentStepIndex = (status) => {
    return steps.findIndex(step => step.key === status);
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px'
    }}>
      <UserNavbar userName={userName} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: '900px', margin: '20px auto', width: '100%' }}>
        {/* Header + Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontWeight: '700', fontSize: '2rem', margin: 0 }}>My Facelift Kit Bookings</h2>
          <button
            className="btn btn-info"
            style={{ fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer' }}
            onClick={() => navigate('/user/dashboard/servicebookings')}
          >
            Service Bookings
          </button>
        </div>

        <p style={{ color: 'white', textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem' }}>
          Track your booking status in real-time — hassle-free and transparent.
        </p>

        {kitBookings.length === 0 ? (
          <p style={{ color: 'white', fontSize: '1.25rem', textAlign: 'center' }}>No kit bookings found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {kitBookings.map((booking, idx) => {
              const currentStep = getCurrentStepIndex(booking.bookingStatus);

              return (
                <div key={idx} style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                  {/* Top row: Kit & Car + Price + Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div>
                      <h4 style={{ color: '#0d6efd', marginBottom: '4px' }}>{booking.kitName || 'Unknown Kit'}</h4>
                      <p style={{ margin: 0, color: '#333' }}><strong>Car:</strong> {booking.carModel}</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '700', fontSize: '1.25rem', color: '#198754', marginBottom: '6px' }}>
                        ₹{booking.price || 0}
                      </p>
                      <span
                        className={`badge rounded-pill ${getBadgeClass(booking.bookingStatus)}`}
                        style={{ fontSize: '0.9rem', padding: '8px 15px', whiteSpace: 'nowrap' }}
                      >
                        {booking.bookingStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Image if available */}
                  {booking.images && booking.images.length > 0 && (
                    <img
                      src={`http://localhost:8080${booking.images[0]}`}
                      alt="Kit"
                      style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
                    />
                  )}

                  {/* Dates info */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '25px' }}>
                    <div style={{ textAlign: 'center', maxWidth: '45%' }}>
                      <p style={{ fontWeight: '600', marginBottom: '6px' }}>📅 Pickup Date</p>
                      <p style={{ margin: 0, color: '#555' }}>{booking.dropOffDate}</p>
                      <small style={{ color: '#6c757d' }}>
                        Our employee collects your car on this date.
                      </small>
                    </div>

                    <div style={{ textAlign: 'center', maxWidth: '45%' }}>
                      <p style={{ fontWeight: '600', marginBottom: '6px' }}>📅 Return Date</p>
                      <p style={{ margin: 0, color: '#555' }}>{booking.pickUpDate}</p>
                      <small style={{ color: '#6c757d' }}>
                        Your car will be delivered back fully serviced.
                      </small>
                    </div>
                  </div>

                  {/* Progress tracker */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 10px' }}>
                    {steps.map((step, i) => {
                      const isCompleted = i < currentStep;
                      const isCurrent = i === currentStep;

                      return (
                        <div key={step.key} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                          {/* Circle */}
                          <div style={{
                            width: '28px',
                            height: '28px',
                            margin: '0 auto 8px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted || isCurrent ? '#0d6efd' : '#ced4da',
                            color: isCompleted || isCurrent ? 'white' : '#6c757d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: '700',
                            userSelect: 'none',
                            zIndex: 2,
                            boxShadow: isCurrent ? '0 0 8px #0d6efd' : 'none',
                            transition: 'background-color 0.3s ease'
                          }}>
                            {step.emoji}
                          </div>

                          {/* Step label */}
                          <div style={{
                            fontSize: '0.85rem',
                            color: isCompleted || isCurrent ? '#0d6efd' : '#6c757d',
                            fontWeight: isCurrent ? '700' : '400',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                            width: 'max-content',
                            margin: '0 auto'
                          }}>
                            {step.label}
                          </div>

                          {/* Connector line except last */}
                          {i < steps.length - 1 && (
                            <div style={{
                              position: 'absolute',
                              top: '14px',
                              right: 0,
                              width: '100%',
                              height: '4px',
                              backgroundColor: i < currentStep ? '#0d6efd' : '#ced4da',
                              zIndex: 1,
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Status description */}
                  <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#444', fontSize: '1rem' }}>
                    {statusMessages[booking.bookingStatus] || statusMessages.DEFAULT}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitBookings;
