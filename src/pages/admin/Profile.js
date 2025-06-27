import React, { useEffect, useState } from 'react';
import { getAdminProfile, updateAdminProfile, checkAdminSession } from '../../services/adminService';
import { Modal, Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserEdit } from 'react-icons/fa';
import UserNavbar from '../../components/UserNavbar';

const AdminProfile = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [editUser, setEditUser] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await checkAdminSession();
        if (session.authenticated) {
          setUserId(session.adminId);
          fetchUser(session.adminId);
        } else {
          toast.error('admin not authenticated');
        }
      } catch (error) {
        toast.error('Error fetching session data');
      }
    };
    fetchSession();
  }, []);

  const fetchUser = async (id) => {
    try {
      const response = await getAdminProfile(id);
      setUser(response);
      setEditUser(response);
    } catch (error) {
      toast.error('Error fetching user details');
    }
  };

  const validateName = (value) => {
    if (!value.trim()) {
      setNameError("Name is required.");
      return false;
    } else if (value.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
      setNameError("Name must be at least 3 characters and contain only letters.");
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      setEmailError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format.");
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateMobile = (value) => {
    if (!value.trim()) {
      setMobileError("Mobile number is required.");
      return false;
    }
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(value)) {
      setMobileError("Enter a valid 10-digit mobile number starting with 6-9.");
      return false;
    }
    setMobileError('');
    return true;
  };

  const isFormValid = () => {
    return (
      editUser.name && editUser.email && editUser.mobile &&
      !nameError && !emailError && !mobileError
    );
  };

  const handleUserUpdate = async () => {
    const isNameValid = validateName(editUser.name);
    const isEmailValid = validateEmail(editUser.email);
    //const isMobileValid = validateMobile(editUser.mobile);

    if (!isNameValid || !isEmailValid ) return;

    try {
      await updateAdminProfile(userId, editUser);
      setShowUserModal(false);
      fetchUser(userId);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
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
      <UserNavbar />
      <Container className="mt-5 pt-5">
        <ToastContainer />
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm p-4 mb-4 rounded">
              <Card.Body>
                <h4 className="text-primary">My Profile</h4>
                <Card.Text><strong>Name:</strong> {user.name}</Card.Text>
                <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
               {/*} <Card.Text><strong>Mobile:</strong> {user.mobile}</Card.Text>
                <Card.Text><strong>Address:</strong> {user.address}</Card.Text>
              */}  <Button variant="outline-primary" onClick={() => setShowUserModal(true)}>
                  <FaUserEdit /> Edit Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Personal Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser.name || ''}
                  onChange={(e) => {
                    setEditUser({ ...editUser, name: e.target.value });
                    validateName(e.target.value);
                  }}
                />
                {nameError && <small className="text-danger">{nameError}</small>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editUser.email || ''}
                  onChange={(e) => {
                    setEditUser({ ...editUser, email: e.target.value });
                    validateEmail(e.target.value);
                  }}
                />
                {emailError && <small className="text-danger">{emailError}</small>}
              </Form.Group>

            {/*  <Form.Group className="mb-3">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser.mobile || ''}
                  onChange={(e) => {
                    setEditUser({ ...editUser, mobile: e.target.value });
                    validateMobile(e.target.value);
                  }}
                />
                {mobileError && <small className="text-danger">{mobileError}</small>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editUser.address || ''}
                  onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                />
              </Form.Group>

              */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUserModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUserUpdate} disabled={!isFormValid()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminProfile;