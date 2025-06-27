import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAdminServices,
  addAdminService,
  updateAdminService,
  deleteAdminService,
} from '../../services/adminService';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    budget: '',
    discountPercentage: '',
    is_active: true,
  });
  const [editService, setEditService] = useState(null);

  useEffect(() => {
    refreshServices();
  }, []);

  const refreshServices = async () => {
    try {
      const servicesData = await getAdminServices();
      const formattedServices = servicesData.map(service => ({
        ...service,
        discountPercentage: service.discountPercentage ?? 0,
      }));
      setServices(formattedServices);
    } catch (error) {
      toast.error("Error fetching services");
      console.error(error);
    }
  };

  const resetNewService = () => {
    setNewService({
      name: '',
      description: '',
      budget: '',
      discountPercentage: '',
      is_active: true,
    });
  };

  const validateService = (service) => {
    if (!service.name.trim()) {
      toast.error("Service name is required");
      return false;
    }
    if (!service.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!service.budget || isNaN(service.budget) || parseFloat(service.budget) <= 0) {
      toast.error("Enter a valid positive number for budget");
      return false;
    }
    if (
      service.discountPercentage === '' ||
      isNaN(service.discountPercentage) ||
      parseFloat(service.discountPercentage) < 0 ||
      parseFloat(service.discountPercentage) > 100
    ) {
      toast.error("Discount must be a number between 0 and 100");
      return false;
    }
    return true;
  };

  const handleAddService = async () => {
    const formattedService = {
      ...newService,
      budget: parseFloat(newService.budget),
      discountPercentage: parseFloat(newService.discountPercentage),
    };

    if (!validateService(formattedService)) return;

    try {
      await addAdminService(formattedService);
      toast.success("Service added successfully!");
      refreshServices();
      resetNewService();
    } catch (error) {
      toast.error("Failed to add service");
    }
  };

  const handleUpdateService = async () => {
    if (!editService) return;

    const formattedEditService = {
      ...editService,
      budget: parseFloat(editService.budget),
      discountPercentage: parseFloat(editService.discountPercentage),
    };

    if (!validateService(formattedEditService)) return;

    try {
      await updateAdminService(editService.id, formattedEditService);
      toast.success("Service updated successfully!");
      refreshServices();
      setEditService(null);
    } catch (error) {
      toast.error("Failed to update service");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteAdminService(id);
      toast.error("Service deleted successfully!");
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      toast.error("Services are ongoing You can't delete services");
    }
  };

  const handleInputChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditService({ ...editService, [field]: value });
    } else {
      setNewService({ ...newService, [field]: value });
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
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container py-5">
        <div className="card shadow-lg bg-light p-4 mb-5 rounded-4">
          <h4 className="mb-4 text-center fw-bold">
            {editService ? 'Update Service' : 'Add New Service'}
          </h4>
          <div className="row g-3 justify-content-center">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                value={editService ? editService.name : newService.name}
                onChange={(e) => handleInputChange('name', e.target.value, !!editService)}
                placeholder="Service Name"
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                value={editService ? editService.description : newService.description}
                onChange={(e) => handleInputChange('description', e.target.value, !!editService)}
                placeholder="Description"
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={editService ? editService.budget : newService.budget}
                onChange={(e) => handleInputChange('budget', e.target.value, !!editService)}
                placeholder="Budget"
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={editService ? editService.discountPercentage : newService.discountPercentage}
                onChange={(e) => handleInputChange('discountPercentage', e.target.value, !!editService)}
                placeholder="Discount %"
              />
            </div>
            <div className="col-md-2 d-grid">
              {editService ? (
                <button className="btn btn-warning" onClick={handleUpdateService}>
                  Update
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleAddService}>
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-center text-white mb-4">All Services</h3>
        <div className="row g-4 justify-content-center">
          {services.length > 0 ? services.map((service) => (
            <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={service.id}>
              <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-3">
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title fw-bold text-dark">{service.name}</h5>
                  <p className="fw-semibold text-secondary px-3">{service.description}</p>
                  <p className="text-success fw-bold">Budget: ₹{service.budget}</p>
                  {service.discountPercentage > 0 && (
                    <p className="text ">Discount: {service.discountPercentage}%</p>
                  )}
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setEditService(service)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteService(service.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-white text-center">No services available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
