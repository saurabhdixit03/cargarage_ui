import React, { useEffect, useState } from 'react';
import { getUserCars, addUserCar, updateUserCar, deleteUserCar, checkUserSession } from '../../services/userService';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import UserNavbar from '../../components/UserNavbar';

const UserCars = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [cars, setCars] = useState([]);
  const [showCarModal, setShowCarModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [carData, setCarData] = useState({ id: '', color: '', licensePlate: '', make: '', model: '' });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await checkUserSession();
        if (session.authenticated) {
          setUserId(session.userId);
          setUserName(session.name || "User");
          toast.success(`Welcome back, ${session.name}! `, {
            position: "top-right",
            autoClose: 1000,
            theme: "dark"
          });
          fetchCars(session.userId);
        } else {
          toast.error('User not authenticated');
        }
      } catch (error) {
        toast.error('Error fetching session data');
      }
    };
    fetchSession();
  }, []);

  const fetchCars = async (id) => {
    try {
      const response = await getUserCars(id);
      setCars(response || []);
    } catch (error) {
      toast.error('Error fetching user cars');
    }
  };

  const handleSaveCar = async () => {
    try {
      if (editMode) {
        await updateUserCar(carData.id, carData);
        toast.success('Car updated successfully!');
      } else {
        await addUserCar(userId, carData);
        toast.success('Car added successfully!');
      }
      setShowCarModal(false);
      fetchCars(userId);
    } catch (error) {
      toast.error('Failed to save car details');
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      await deleteUserCar(carId);
      toast.success('Car deleted successfully!');
      fetchCars(userId);
    } catch (error) {
      toast.error('This car has scheduled appointments and cannot be deleted.');
    }
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <UserNavbar userName={userName} />
      <ToastContainer position="top-right" autoClose={30} />

      <div className="container-fluid d-flex flex-column align-items-center">
        <div className="d-flex justify-content-between align-items-center w-100 px-4 mt-4 mb-2">
          <h2 className="text-white fw-bold">My Cars</h2>
          <Button
            variant="light"
            className="fw-semibold"
            onClick={() => {
              setEditMode(false);
              setCarData({ id: '', color: '', licensePlate: '', make: '', model: '' });
              setShowCarModal(true);
            }}
          >
            + Add New Car
          </Button>
        </div>

        <div className="row g-4 justify-content-center w-100 px-4 pb-4">
          {cars.length > 0 ? cars.map((car) => (
            <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={car.id}>
              <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-3">
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title fw-bold text-dark">{car.make} {car.model}</h5>
                  <p className="fw-semibold text-secondary">Color: {car.color}</p>
                  <p className="text-muted"> {car.licensePlate || 'N/A'}</p>
                  <div className="d-flex gap-2 mt-2">
                    <Button variant="outline-primary" size="sm" onClick={() => {
                      setEditMode(true);
                      setCarData(car);
                      setShowCarModal(true);
                    }}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCar(car.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-white">You don't have any cars yet.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal show={showCarModal} onHide={() => setShowCarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Car' : 'Add New Car'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['color', 'licensePlate', 'make', 'model'].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label className="text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                <Form.Control
                  type="text"
                  value={carData[field]}
                  onChange={(e) => setCarData({ ...carData, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCarModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveCar}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserCars;
