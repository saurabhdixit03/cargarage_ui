import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // <--- added this
import UserNavbar from '../../components/Navbar';
import {
  getFaceliftKits,
  addFaceliftKit,
  updateFaceliftKit,
  deleteFaceliftKit,
} from '../../services/adminService';
import 'react-toastify/dist/ReactToastify.css';

// Define your backend base URL here (adjust if needed for production)
const BACKEND_BASE_URL = "http://localhost:8080";

const FaceliftKitManagement = () => {
  const [kits, setKits] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [formData, setFormData] = useState({
    carMake: '',
    carModel: '',
    kitName: '',
    availableCount: '',
    description: '',
    price: '',
    img_url: '',
    is_active: true,
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [editKitId, setEditKitId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();  // <--- added this

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      const kitsData = await getFaceliftKits();
      setKits(kitsData || []);
    } catch (error) {
      toast.error("Failed to fetch kits.");
      console.error("Error fetching kits:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const renderImagePreviews = () => {
    if (selectedImages.length === 0) return null;
    return (
      <div className="d-flex gap-2 my-2 flex-wrap">
        {selectedImages.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
          />
        ))}
      </div>
    );
  };

  const validateForm = () => {
    const { carMake, carModel, kitName, availableCount, description, price } = formData;
    if (!carMake || !carModel || !kitName || !availableCount || !description || !price) {
      toast.warning("Please fill in all required fields.");
      return false;
    }
    if (isNaN(price) || Number(price) <= 0) {
      toast.warning("Please enter a valid price.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      if (editKitId) {
        await updateFaceliftKit(editKitId, formData, selectedImages);
        toast.success("Facelift Kit updated successfully!");
      } else {
        await addFaceliftKit(formData, selectedImages);
        toast.success(
          "Facelift kit added successfully! ✨ Emails sent to Customers with matching cars.",
          {
            position: "top-right",
            autoClose: 5000, // 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      setFormData({
        carMake: '',
        carModel: '',
        kitName: '',
        availableCount: '',
        description: '',
        price: '',
        img_url: '',
        is_active: true,
      });
      setSelectedImages([]);
      setEditKitId(null);
      fetchKits();
    } catch (error) {
      toast.error("Something went wrong. Try again.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditKit = (kit) => {
    setFormData({
      carMake: kit.carMake,
      carModel: kit.carModel,
      kitName: kit.kitName,
      availableCount: kit.availableCount,
      description: kit.description,
      price: kit.price,
      img_url: kit.img_url || '',
      is_active: kit.is_active,
    });
    setSelectedImages([]); // Clear selected images on edit; can be extended to preload images if desired
    setEditKitId(kit.id);
  };

  const handleDeleteKit = async (kitId) => {
    try {
      await deleteFaceliftKit(kitId);
      toast.success("Facelift Kit deleted successfully!");
      fetchKits();
    } catch (error) {
      toast.error("Failed to delete kit.");
      console.error("Delete error:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <UserNavbar userName={userName} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container my-5 text-white">
        
        {/* HEADER with VIEW BOOKINGS BUTTON */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">{editKitId ? "Edit Facelift Kit" : "Add New Facelift Kit"}</h4>
          <button
            className="btn btn-outline-warning fw-semibold"
            onClick={() => navigate("/admin/dashboard/faceliftbookings")}
          >
            📋 View Bookings
          </button>
        </div>

        <div className="card bg-light text-dark rounded-4 shadow-lg p-4 mb-5">
          <div className="row g-3 mt-2">
            {[
              { name: 'carMake', placeholder: 'Car Make' },
              { name: 'carModel', placeholder: 'Car Model' },
              { name: 'kitName', placeholder: 'Kit Name' },
              { name: 'availableCount', placeholder: 'Number of Kits' },
              { name: 'description', placeholder: 'Description' },
              { name: 'price', placeholder: 'Price' },
            ].map((field, idx) => (
              <div className="col-md-3" key={idx}>
                <input
                  type={field.name === 'price' || field.name === 'availableCount' ? 'number' : 'text'}
                  name={field.name}
                  className="form-control"
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            {/* Image Upload */}
            <div className="col-md-3">
              <label className="form-label text-dark fw-semibold">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-control"
              />
              {renderImagePreviews()}
            </div>

            <div className="col-md-3 d-grid">
              <button
                className={`btn ${editKitId ? 'btn-warning' : 'btn-primary'}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (editKitId ? 'Updating...' : 'Adding...')
                  : (editKitId ? 'Update Kit' : 'Add Kit')}
              </button>
            </div>
          </div>
        </div>

        <h3 className="text-center fw-bold mb-4">Available Facelift Kits</h3>
        <div className="row g-4 justify-content-center">
          {kits.length > 0 ? kits.map((kit) => (
            <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={kit.id}>
              <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-3">
                <div className="card-body d-flex flex-column align-items-center">
                  {kit.images && kit.images.length > 0 ? (
                    <div className="mb-3 d-flex justify-content-center gap-2 flex-wrap">
                      {kit.images.map((imgUrl, idx) => (
                        // IMPORTANT: prepend backend URL to imgUrl
                        <img
                          key={idx}
                          src={`${BACKEND_BASE_URL}${imgUrl}`}
                          alt={`Kit Image ${idx + 1}`}
                          style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 8 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#999', fontStyle: 'italic', marginBottom: '10px' }}>
                      No Images Available
                    </div>
                  )}
                  <h5 className="card-title fw-bold text-dark">{kit.kitName} ({kit.availableCount})</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{kit.carMake} - {kit.carModel}</h6>
                  <p className="card-text text-dark">{kit.description}</p>
                  <p className="fw-semibold fs-5 text-success">₹ {kit.price}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm flex-grow-1"
                      onClick={() => handleEditKit(kit)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm flex-grow-1"
                      onClick={() => handleDeleteKit(kit.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-muted">No facelift kits available right now.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceliftKitManagement;
