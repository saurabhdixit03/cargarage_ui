import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAdminAppointmentsWithDetails,
  updateAdminAppointmentStatus
} from '../../services/adminService';

const AppointmentManagement = () => {
  const [groupedAppointments, setGroupedAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAdminAppointmentsWithDetails();
      const sortedData = data.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
      const grouped = groupAppointments(sortedData);
      setGroupedAppointments(grouped);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments.');
    }
  };

  const handleGroupUpdateStatus = async (appointments, newStatus) => {
    try {
      await Promise.all(
        appointments.map((appt) => updateAdminAppointmentStatus(appt.appointmentId, newStatus))
      );
      fetchAppointments();
      toast.success(`Appointments marked as ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Failed to update appointments:', error);
      toast.error(`Failed to mark appointments as ${newStatus.toLowerCase()}.`);
    }
  };

  const groupAppointments = (appointments) => {
    const customerMap = new Map();
    appointments.forEach((appt) => {
      if (!customerMap.has(appt.customerName)) {
        customerMap.set(appt.customerName, []);
      }
      customerMap.get(appt.customerName).push(appt);
    });

    return Array.from(customerMap.entries()).map(([customerName, appts]) => ({
      customerName,
      mobile: appts[0].mobile,
      cars: appts.reduce((acc, appt) => {
        if (!acc[appt.carModel]) acc[appt.carModel] = [];
        acc[appt.carModel].push(appt);
        return acc;
      }, {})
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-success';
      case 'Rejected':
        return 'text-danger';
      case 'Canceled':
        return 'text-secondary';
      default:
        return 'text-warning';
    }
  };

  return (
    <div style={{ backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container my-5">
        <h1 className="text-center mb-4 fw-bold text-white">Service Appointments</h1>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light text-center">
              <tr>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Car Model</th>
                <th>Date</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {groupedAppointments.length > 0 ? (
                groupedAppointments.map((group, groupIndex) => {
                  const customerCarEntries = Object.entries(group.cars);
                  let totalAppointments = customerCarEntries.reduce((acc, [_, appts]) => acc + appts.length, 0);
                  let rowIndex = 0;

                  return customerCarEntries.flatMap(([carModel, appointments]) => {
                    const dateWiseAppointments = appointments
                      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                      .reduce((acc, appt) => {
                        if (!acc[appt.appointmentDate]) acc[appt.appointmentDate] = [];
                        acc[appt.appointmentDate].push(appt);
                        return acc;
                      }, {});

                    return Object.entries(dateWiseAppointments).flatMap(([date, dateAppts], dateIndex) => {
                      const totalBudget = dateAppts.reduce((sum, appt) => sum + appt.budget, 0);
                      const unifiedStatus = dateAppts[0]?.status;

                      const rowElements = dateAppts.map((appt, apptIndex) => {
                        const renderCustomer = rowIndex === 0;
                        const renderCar = dateIndex === 0 && apptIndex === 0;
                        const renderDate = apptIndex === 0;
                        const renderTotal = apptIndex === 0;
                        const renderStatus = apptIndex === 0;
                        const renderActions = apptIndex === 0;

                        const row = (
                          <tr key={appt.appointmentId}>
                            {renderCustomer && (
                              <>
                                <td rowSpan={totalAppointments}>{group.customerName}</td>
                                <td rowSpan={totalAppointments}>{group.mobile}</td>
                              </>
                            )}
                            {renderCar && <td rowSpan={Object.values(dateWiseAppointments).flat().length}>{carModel}</td>}
                            {renderDate ? <td rowSpan={dateAppts.length}>{date}</td> : null}
                            <td>{appt.serviceType}</td>
                            <td>₹{appt.budget}</td>
                            {renderTotal ? <td rowSpan={dateAppts.length}>₹{totalBudget}</td> : null}
                            {renderStatus ? (
                              <td rowSpan={dateAppts.length} className={getStatusColor(unifiedStatus)}>
                                {unifiedStatus}
                              </td>
                            ) : null}
                            {renderActions ? (
                              <td rowSpan={dateAppts.length}>
                                <button
                                  className="btn btn-sm btn-outline-success me-2 mb-1"
                                  onClick={() => handleGroupUpdateStatus(dateAppts, 'Accepted')}
                                  disabled={dateAppts.every((a) => a.status === 'Accepted')}
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger me-2 mb-1"
                                  onClick={() => handleGroupUpdateStatus(dateAppts, 'Rejected')}
                                  disabled={dateAppts.every((a) => a.status === 'Rejected')}
                                >
                                  Reject
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handleGroupUpdateStatus(dateAppts, 'Canceled')}
                                  disabled={dateAppts.every((a) => a.status === 'Canceled')}
                                >
                                  Cancel
                                </button>
                              </td>
                            ) : null}
                          </tr>
                        );
                        rowIndex++;
                        return row;
                      });

                      return rowElements;
                    });
                  });
                })
              ) : (
                <tr>
                  <td colSpan="9">No appointments available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
