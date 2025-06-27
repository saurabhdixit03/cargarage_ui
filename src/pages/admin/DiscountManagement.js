import Navbar from '../../components/Navbar';
import React, { useState, useEffect } from 'react';
import {
  getAdminDiscounts,
  addAdminDiscount,
  updateAdminDiscount,
  removeAdminDiscount,
  getAdminCustomers,
  getRepeatCustomers,
  getAdminServices
} from '../../services/adminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const DiscountManagement = () => {
  const [regularCustomers, setRegularCustomers] = useState([]);
  const [repeatCustomers, setRepeatCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    description: '',
    discountPercentage: '',
    serviceIds: [],
    validUntil: '',
    isExclusive: false,
    customerType: [],
  });
  const [editDiscount, setEditDiscount] = useState(null);

  useEffect(() => {
    fetchDiscounts();
    fetchRegularCustomers();
    fetchRepeatCustomers();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getAdminServices();
      setServices(res);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const discountData = await getAdminDiscounts();
      setDiscounts(discountData);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const fetchRegularCustomers = async () => {
    try {
      const customers = await getAdminCustomers();
      setRegularCustomers(customers.map(c => c.id));
    } catch (error) {
      console.error("Error fetching regular customers:", error);
    }
  };

  const fetchRepeatCustomers = async () => {
    try {
      const repeatData = await getRepeatCustomers();
      setRepeatCustomers(repeatData.map(c => c.id));
    } catch (error) {
      console.error("Error fetching repeat customers:", error);
    }
  };

  const showToast = (msg) => {
    toast.success(msg, { autoClose: 2000 });
  };

  const handleAddDiscount = async () => {
    let customerType = null;

    if (newDiscount.customerType.includes("regular")) customerType = "REGULAR";
    else if (newDiscount.customerType.includes("repeat")) customerType = "REPEAT";

    if (!customerType) {
      toast.error("Please select a customer type!");
      return;
    }

    const discountPercentage = parseFloat(newDiscount.discountPercentage);
    if (isNaN(discountPercentage) || discountPercentage <= 0) {
      toast.error("Invalid discount percentage!");
      return;
    }

    const payload = {
      ...newDiscount,
      discountPercentage,
      customerType,
      serviceIds: newDiscount.serviceIds.map(id => parseInt(id))
    };

    try {
      await addAdminDiscount(payload);
      fetchDiscounts();
      resetNewDiscount();
      showToast("Discount added successfully!");
    } catch (error) {
      console.error("Error Adding Discount:", error.response?.data);
      toast.error(`Failed to add discount: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  const handleUpdateDiscount = async () => {
    if (editDiscount) {
      const payload = {
        ...editDiscount,
        discountPercentage: parseFloat(editDiscount.discountPercentage),
        serviceIds: editDiscount.serviceIds.map(id => parseInt(id)),
        customerType: editDiscount.customerType[0]
      };

      try {
        await updateAdminDiscount(editDiscount.id, payload);
        fetchDiscounts();
        setEditDiscount(null);
        showToast('Discount updated successfully!');
      } catch (err) {
        toast.error("Failed to update discount");
      }
    }
  };

  const handleEditDiscount = (discount) => {
    setEditDiscount({
      ...discount,
      validUntil: discount.validUntil?.split('T')[0] || '',
      customerType: [discount.customerType],
      serviceIds: discount.serviceIds || [],
    });
  };

  const handleDeleteDiscount = async (id) => {
    await removeAdminDiscount(id);
    setDiscounts(discounts.filter((discount) => discount.id !== id));
    showToast('Discount deleted!');
  };

  const resetNewDiscount = () => {
    setNewDiscount({
      name: '',
      description: '',
      discountPercentage: '',
      serviceIds: [],
      validUntil: '',
      isExclusive: false,
      customerType: [],
    });
  };

  const handleCustomerTypeChange = (type) => {
    setNewDiscount((prev) => {
      let updated = [...prev.customerType];
      updated = updated.includes(type) ? updated.filter(t => t !== type) : [...updated, type];
      return { ...prev, customerType: updated };
    });
  };

  const getBadgeStyle = (type) => ({
    backgroundColor: type === 'REPEAT' ? '#4caf50' : '#2196f3',
    color: 'white',
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '12px',
    marginBottom: '8px',
    display: 'inline-block'
  });

  const renderServiceSelection = (isEdit = false) => {
    return (
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '8px 0',
          gap: '10px',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
        onWheel={(e) => {
          if (e.deltaY !== 0) {
            e.preventDefault(); // Block page scroll
            e.currentTarget.scrollLeft += e.deltaY; // Scroll the services sideways
          }
        }}
        className="hide-scrollbar"
      >
        {services.map((service) => {
          const isSelected = isEdit
            ? editDiscount?.serviceIds?.includes(service.id)
            : newDiscount.serviceIds.includes(service.id);
  
          const handleClick = () => {
            const currentIds = isEdit ? [...editDiscount.serviceIds] : [...newDiscount.serviceIds];
            const updatedIds = currentIds.includes(service.id)
              ? currentIds.filter(id => id !== service.id)
              : [...currentIds, service.id];
  
            isEdit
              ? setEditDiscount({ ...editDiscount, serviceIds: updatedIds })
              : setNewDiscount({ ...newDiscount, serviceIds: updatedIds });
          };
  
          return (
            <span
              key={service.id}
              onClick={handleClick}
              style={{
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                backgroundColor: isSelected ? '#007bff' : 'transparent',
                color: isSelected ? 'white' : '#333',
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid #007bff',
                transition: 'all 0.2s ease-in-out',
                flex: '0 0 auto',
                userSelect: 'none',
              }}
            >
              {service.name}
            </span>
          );
        })}
      </div>
    );
  };
  

  

  return (
    <div style= {{backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'}}>
      <Navbar />
      <div className="container my-5">
        <ToastContainer />

        <div
  className="card p-4 mb-4"
  style={{
    
    borderRadius: '16px',
    background: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e0e0e0',
    transition: 'box-shadow 0.3s ease-in-out',
  }}
  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)')}
  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)')}
>
  <h4 className="text-center fw-bold mb-4">{editDiscount ? 'Update Discount' : 'Add New Discounts'}</h4>
  <div className="row g-4 justify-content-center">
    {['name', 'description'].map((field, idx) => (
      <div className="col-md-4" key={idx}>
        <input
          type="text"
          className="form-control"
          style={{ borderRadius: '12px', padding: '10px 14px', border: '1px solid #ddd' }}
          value={editDiscount ? editDiscount[field] : newDiscount[field]}
          onChange={(e) =>
            editDiscount
              ? setEditDiscount({ ...editDiscount, [field]: e.target.value })
              : setNewDiscount({ ...newDiscount, [field]: e.target.value })
          }
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
        />
      </div>
    ))}

    <div className="col-md-4">
      <div>{renderServiceSelection(!!editDiscount)}</div>
    </div>

    <div className="col-md-2">
      <input
        type="number"
        className="form-control"
        style={{ borderRadius: '12px', padding: '10px 14px', border: '1px solid #ddd' }}
        value={editDiscount ? editDiscount.discountPercentage : newDiscount.discountPercentage}
        onChange={(e) =>
          editDiscount
            ? setEditDiscount({ ...editDiscount, discountPercentage: e.target.value })
            : setNewDiscount({ ...newDiscount, discountPercentage: e.target.value })
        }
        placeholder="Discount %"
      />
    </div>

    <div className="col-md-4">
      <input
        type="date"
        className="form-control"
        style={{ borderRadius: '12px', padding: '10px 14px', border: '1px solid #ddd' }}
        value={editDiscount ? editDiscount.validUntil : newDiscount.validUntil}
        onChange={(e) =>
          editDiscount
            ? setEditDiscount({ ...editDiscount, validUntil: e.target.value })
            : setNewDiscount({ ...newDiscount, validUntil: e.target.value })
        }
      />
    </div>

    <div className="col-md-4 d-flex gap-3 flex-wrap align-items-center">
      {['regular', 'repeat'].map((type, i) => {
        const isSelected = editDiscount
          ? editDiscount.customerType === type.toUpperCase()
          : newDiscount.customerType === type;

        const handleClick = () => {
          if (editDiscount) {
            setEditDiscount({ ...editDiscount, customerType: type.toUpperCase() });
          } else {
            setNewDiscount({ ...newDiscount, customerType: type });
          }
        };

        return (
          <span
            key={i}
            onClick={handleClick}
            style={{
              cursor: 'pointer',
              backgroundColor: isSelected ? '#007bff' : '#f0f0f0',
              color: isSelected ? 'white' : '#333',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '14px',
              border: isSelected ? '1px solid #007bff' : '1px solid #ccc',
              fontWeight: 500,
              transition: 'all 0.2s ease-in-out',
              userSelect: 'none',
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Customer
          </span>
        );
      })}
    </div>

    <div className="col-md-2 d-grid">
      <button
        className={`btn ${editDiscount ? 'btn-warning' : 'btn-primary'}`}
        style={{ borderRadius: '12px', padding: '10px 16px', fontWeight: 600 }}
        onClick={editDiscount ? handleUpdateDiscount : handleAddDiscount}
      >
        {editDiscount ? 'Update' : 'Add'} Discount
      </button>
    </div>
  </div>
</div>


        <div className="row">
          {discounts.map((discount) => {
            const cardStyle = {
              backgroundColor: discount.customerType === 'REPEAT' ? '#ffe4c4' : '#f0f8ff',
              border: '1px solid #ccc',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            };

            return (
              <div key={discount.id} className="col-md-4 mb-3">
                <div style={cardStyle}>
                  <h5 className='card-title fw-bold text-dark'>{discount.name}</h5>
                  <p className='fw-semibold text-secondary'>{discount.description}</p>
                  <p className='text-success fw-bold'><strong>Discount:</strong> {discount.discountPercentage}%</p>
                  <p className='fw-semibold text-secondary'>Valid Until: {discount.validUntil}</p>
                  <p className='fw-semibold text'>Applicable Services: {discount.serviceNames?.join(', ') || 'N/A'}</p>
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditDiscount(discount)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteDiscount(discount.id)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiscountManagement;