import React, { useEffect, useState } from "react";
import { getUserDiscounts, checkUserSession } from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import "bootstrap-icons/font/bootstrap-icons.css";

const UserDiscounts = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let currentDiscountCount = 0;

    const fetchData = async () => {
      try {
        const sessionResponse = await checkUserSession();
        if (!sessionResponse || !sessionResponse.authenticated) {
          navigate("/user/login");
          return;
        }

        setUserName(sessionResponse.name || "User");

        toast.success(`Welcome back, ${sessionResponse.name}! `, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        const response = await getUserDiscounts();

        if (response.message === "Access denied") {
          toast.error("You are not eligible for discounts ❌");
          setDiscounts([]);
          return;
        }

        setDiscounts(response);
        currentDiscountCount = response.length;
      } catch (error) {
        toast.error("Failed to fetch discounts ❌");
        console.error("Error fetching discounts:", error);
      } finally {
        setLoading(false);
      }
    };

    const pollForNewDiscounts = async () => {
      try {
        const latest = await getUserDiscounts();
        if (latest.length > currentDiscountCount) {
          toast.info("🎁 New discount available for you!");
          setDiscounts(latest);
          currentDiscountCount = latest.length;
        }
      } catch (error) {
        console.error("Polling failed:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(pollForNewDiscounts, 30000);
    return () => clearInterval(intervalId);
  }, [navigate]);

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
        <h2 className="text-center mb-4 fw-bold text-white">
          <i className="bi bi-bell-fill me-2"></i>
          {`Hello ${userName}, you’ve got some exclusive offers!`}
        </h2>
        <p className="text-center text-white">Check out these special discounts just for you</p>

        <div className="row g-4 justify-content-center" style={{ width: '85%'  }}  >
          {loading ? (
            <p className="text-white">Loading your discounts...</p>
          ) : discounts.length > 0 ? (
            discounts.map((discount) => {
              const validUntilDate = discount.validUntil ? new Date(discount.validUntil) : null;
              const isExpired = validUntilDate && validUntilDate < new Date();
              const daysLeft = validUntilDate ? Math.ceil((validUntilDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

              

              return (
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex"   key={discount.id}>
                  <div className={`card shadow-lg text-center border-0 rounded-4 w-100 h-100 p-3 ${isExpired ? "bg-light text-muted" : "bg-white"}`}  style = {{backgroundColor:'#ffe4c4'}} >
                    <div className="card-body d-flex flex-column align-items-center" >
                      <h5 className="card-title fw-bold text-dark" >
                        <i className="bi bi-gift-fill me-2 text-primary"></i>
                        {discount.name}
                      </h5>
                      <p className="fw-semibold text-secondary px-3">{discount.description}</p>
                      <p className="text-success fw-bold">Discount: {discount.discountPercentage || 0}%</p>
                     {/* <p className="text-secondary"><strong>Package:</strong> {discount.packageDetails}</p> */}
                      <p className="text-secondary"><strong>Services:</strong> {discount.serviceNames || 'None'}</p>
                      <p>
                        <strong>Valid Until:</strong> {validUntilDate ? validUntilDate.toLocaleDateString() : "N/A"}
                        {daysLeft && daysLeft > 0 && !isExpired && (
                          <span className="badge bg-warning ms-2">⏳ {daysLeft} days left</span>
                        )}
                      </p>
                      {isExpired && <span className="badge bg-danger">Expired</span>}

                      
                    </div>
                    {!isExpired && (
                      <div className="card-footer bg-transparent border-0 text-center">
                        <Link
                          to="/user/dashboard/DiscountBooking"
                          state={{ discount, serviceIds: discount.serviceIds || [] }}
                          className="btn btn-primary"
                        >
                          Book Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white">No discounts available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDiscounts;
