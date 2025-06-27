import React, { useEffect, useState } from 'react'; 
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/Navbar';
import {
  getAllFaceliftKitBookings,
  updateFaceliftBookingStatus,
} from '../../services/adminService';
import 'react-toastify/dist/ReactToastify.css';
import { connectWebSocket, disconnectWebSocket } from '../../services/websocketService';

const FaceliftBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // track which booking is updating
  const statusOptions = [
    'CAR_RECEIVED',
    'CAR_REACHED_GARAGE',
    'UNDER_SERVICE',
    'KIT_APPLIED',
    'READY_TO_DELIVER',
    'DELIVERED',
    'REQUESTED'
  ];
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();

    // WebSocket subscription for live status updates
    const handleStatusUpdate = (update) => {
      // update = { bookingId, newStatus }
      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === update.bookingId
            ? { ...booking, bookingStatus: update.newStatus }
            : booking
        )
      );
      toast.info(`Booking #${update.bookingId} status updated to ${update.newStatus}`);
    };

    connectWebSocket(handleStatusUpdate);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllFaceliftKitBookings();
      setBookings(data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings.');
      console.error('Fetch bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      await updateFaceliftBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated!');
      // No need to fetch again, WebSocket will update state
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Update status error:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      <UserNavbar userName="Admin" />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Facelift Kit Bookings</h3>
          <button
            className="btn btn-outline-warning fw-semibold"
            onClick={() => navigate('/admin/dashboard/faceliftkits')}
          >
            ← Back to Facelift Kits
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5 fs-5">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-muted py-5 fs-5">
            No facelift kit bookings found.
          </div>
        ) : (
          <div className="row g-4">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="col-lg-6 col-md-8 mx-auto"
              >
                <div className="card bg-light text-dark shadow rounded-4 p-4">
                  <h5 className="fw-bold">{booking.kitName}</h5>
                  <p>
                    <strong>Customer:</strong> {booking.customerName} (
                    {booking.mobile})
                  </p>
                  <p>
                    <strong>Car:</strong> {booking.carModel}
                  </p>
                  <p>
                    <strong>Drop-Off:</strong>{' '}
                    {new Date(booking.dropOffDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Pick-Up:</strong>{' '}
                    {new Date(booking.pickUpDate).toLocaleDateString()}
                  </p>

                  <div className="d-flex align-items-center gap-3 mt-3">
                    <label className="mb-0 fw-semibold" htmlFor={`status-${booking.bookingId}`}>
                      Status:
                    </label>
                    <select
                      id={`status-${booking.bookingId}`}
                      className="form-select w-auto"
                      value={booking.bookingStatus}
                      onChange={(e) =>
                        handleStatusChange(booking.bookingId, e.target.value)
                      }
                      disabled={updatingId === booking.bookingId}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {updatingId === booking.bookingId && (
                      <div className="spinner-border spinner-border-sm text-primary" role="status" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceliftBookingManagement;
