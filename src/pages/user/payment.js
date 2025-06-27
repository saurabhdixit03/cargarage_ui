import React, { useEffect } from 'react';
import { checkUserSession, createPaymentOrder } from '../../services/userService';
import UserNavbar from '../../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, email, name } = location.state || {}; // Extract needed data

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const verifySessionAndStartPayment = async () => {
      try {
        const sessionResponse = await checkUserSession();
        if (!sessionResponse || !sessionResponse.authenticated) {
          navigate('/user/login');
          return;
        }

        if (!amount || !email) {
          toast.error('Invalid payment data. Redirecting...');
          setTimeout(() => navigate('/user/dashboard/servicebookings'), 2000);
          return;
        }

        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded) {
          toast.error('Failed to load Razorpay SDK. Try again later.');
          return;
        }

        const orderData = await createPaymentOrder(amount, email, name || "User");
        if (!orderData || !orderData.razorpayOrderId) {
          toast.error('Failed to initiate payment. Try again.');
          return;
        }

        startRazorpayPayment(orderData);
      } catch (error) {
        console.error('Session check or payment failed:', error);
        toast.error('Something went wrong. Try again later.');
      }
    };

    verifySessionAndStartPayment();
    // eslint-disable-next-line
  }, []);

  const startRazorpayPayment = (orderData) => {
    const options = {
      key: "rzp_test_PV1G13RPQrI2H9", // ✅ Replace with your real Razorpay Key
      amount: orderData.amount * 100, // Convert to paise
      currency: "INR",
      name: "CarGarage Services",
      description: "Service Payment",
      image: "/logo.png",
      order_id: orderData.razorpayOrderId,
      handler: function (response) {
        toast.success("Payment Successful! 🤑", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log("Razorpay Response:", response);
        setTimeout(() => navigate('/user/dashboard/servicebookings'), 2000);
      },
      prefill: {
        email: orderData.email
      },
      theme: {
        color: "#3399cc"
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div style={{ backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', minHeight: '100vh' }}>
      <UserNavbar />
      <ToastContainer />
      <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
        <h3 className="text-white">Processing Payment... 🔄</h3>
      </div>
    </div>
  );
};

export default Payment;
