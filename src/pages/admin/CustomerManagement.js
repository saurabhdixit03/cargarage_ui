import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getAdminCustomersWithDetails } from '../../services/adminService';
import { Link } from 'react-router-dom';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCarsCustomerId, setExpandedCarsCustomerId] = useState(null);
  const [expandedAppointmentsCustomerId, setExpandedAppointmentsCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAdminCustomersWithDetails();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchQuery(term);

    if (!term) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(term)
    );

    setFilteredCustomers(filtered);
  };

  const toggleCars = (customerId) => {
    setExpandedCarsCustomerId(expandedCarsCustomerId === customerId ? null : customerId);
    setExpandedAppointmentsCustomerId(null);
  };

  const toggleAppointments = (customerId) => {
    setExpandedAppointmentsCustomerId(
      expandedAppointmentsCustomerId === customerId ? null : customerId
    );
    setExpandedCarsCustomerId(null);
  };

  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <div className="container my-5">
        <h1 className="text-center mb-4 fw-bold text-white">Customers Overview</h1>

        <div className="mb-4 d-flex justify-content-center">
          <input
            type="text"
            placeholder="Search by customer name..."
            className="form-control w-50 shadow-sm"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th>Sr No</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Cars</th>
                <th>Appointments</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => {
                  const totalAppointments = customer.cars.reduce(
                    (acc, car) => acc + car.appointments.length,
                    0
                  );

                  return (
                    <React.Fragment key={customer.customerId}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.mobile}</td>
                        <td>{customer.address}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => toggleCars(customer.customerId)}
                          >
                            {customer.cars.length} Cars
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => toggleAppointments(customer.customerId)}
                          >
                            {totalAppointments} Appointments
                          </button>
                        </td>
                      </tr>

                      {/* Car Details */}
                      {expandedCarsCustomerId === customer.customerId && (
                        <tr>
                          <td colSpan="7">
                            <div className="table-responsive">
                              <table className="table table-sm bg-white">
                                <thead className="table-light">
                                  <tr>
                                    <th>Sr No</th>
                                    <th>Car Model</th>
                                    <th>Car Number</th>
                                    <th>Color</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {customer.cars.map((car, idx) => (
                                    <tr key={idx}>
                                      <td>{idx + 1}</td>
                                      <td>{car.carModel}</td>
                                      <td>{car.licensePlate}</td>
                                      <td>{car.carColor}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Appointment Details */}
                      {expandedAppointmentsCustomerId === customer.customerId && (
                        <tr>
                          <td colSpan="7">
                            <div className="table-responsive">
                              <table className="table table-sm bg-white">
                                <thead className="table-light">
                                  <tr>
                                    <th>Sr No</th>
                                    <th>Car Model</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {customer.cars.map((car, carIdx) =>
                                    car.appointments.map((app, appIdx) => (
                                      <tr key={`${car.licensePlate}-${appIdx}`}>
                                        <td>{appIdx === 0 ? carIdx + 1 : ''}</td>
                                        <td>{appIdx === 0 ? car.carModel : ''}</td>
                                        <td>{app.serviceType}</td>
                                        <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                                        <td>{app.status}</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-white">
                    No matching customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-4">
          <Link to="/admin/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
