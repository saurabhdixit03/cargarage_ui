import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getCars } from '../../services/adminService';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CarManagement = () => {
  const [carData, setCarData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const data = await getCars();
        setCarData(data);
        setFilteredData(data);
      } catch (err) {
        console.error('Failed to fetch car-customer data:', err);
        toast.error('Failed to load car-customer data');
      }
    };

    fetchCarData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredData(carData);
      return;
    }

    const filtered = carData.filter((item) => {
      return (
        item.carModel.toLowerCase().includes(term) ||
        item.cars.some(
          (car) =>
            car.licensePlate.toLowerCase().includes(term) ||
            car.carColor.toLowerCase().includes(term)
        ) ||
        item.customers.some((cust) => cust.name.toLowerCase().includes(term))
      );
    });

    setFilteredData(filtered);
  };

  let srCounter = 1; // Counter for Sr No.

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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container my-5">
        <h1 className="text-center mb-4 fw-bold text-white">Cars Summary</h1>

        <div className="mb-4 d-flex justify-content-center">
  <input
    type="text"
    placeholder="Search by model, owner, number or color..."
    className="form-control w-50"
    value={searchTerm}
    onChange={handleSearch}
  />
</div>


        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th>Sr No</th>
                <th>Car Name</th>
                <th># Owners</th>
                <th>Owner Name</th>
                <th>Car Number</th>
                <th>Car Color</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  return item.customers.map((owner, idx) => {
                    const car = item.cars[idx];
                    return (
                      <tr key={`${index}-${idx}`}>
                        <td>{srCounter++}</td>
                        <td>{idx === 0 ? item.carModel : ''}</td>
                        <td>{idx === 0 ? item.numberOfCustomers : ''}</td>
                        <td>{owner?.name || 'N/A'}</td>
                        <td>{car?.licensePlate || 'N/A'}</td>
                        <td>{car?.carColor || 'N/A'}</td>
                        <td>{owner?.email || 'N/A'}</td>
                        <td>{owner?.mobile || 'N/A'}</td>
                        <td>{owner?.address || 'N/A'}</td>
                      </tr>
                    );
                  });
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-white">
                    No matching records found.
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

export default CarManagement;
