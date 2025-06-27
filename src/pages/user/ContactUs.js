import React from 'react';
import UserNavbar from '../../components/UserNavbar';

const ContactUs = () => {
  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
      }}
    >
      <UserNavbar />
      <div className="container-fluid d-flex flex-column align-items-center pt-5">
        <h2 className="text-center mb-5 fw-bold display-4 text-shadow">
          
        </h2>

        {/* Contact Details */}
        <div className="row g-4 justify-content-center" style={{ width: '85%' }}>
          <div className="col-lg-6 col-md-6 col-sm-12 d-flex">
            <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-4">
              <div className="card-body d-flex flex-column align-items-center">
                <h5 className="card-title fw-bold text-dark">Chandrika Enterprises</h5>
                <p>
                  <strong>Address:</strong> Sr. No. 99 Plot No: 75, Yashwantnagar, Near Annasaheb Magar Stadium, Pimpari, Pune - 411018, Maharashtra
                </p>
                <p><strong>Phone:</strong> +91 9422045640</p>
                <p><strong>Email:</strong> chandrikaautomobile@gmail.com</p>
                <p><strong>Working Hours:</strong> Mon-Sat, 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="col-lg-6 col-md-6 col-sm-12 d-flex">
            <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-4">
              <iframe
                title="garage-location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.5497731406326!2d73.81954337496602!3d18.639309682477432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b86b865ee12d%3A0x540d6dbd8bc07804!2sChandrika%20Tyres%20%26%20Chandrika%20Car%20Care!5e0!3m2!1sen!2sin!4v1747138250136!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="row mt-5 justify-content-center" style={{ width: '85%' }}>
          <div className="col-md-12">
            <div className="card shadow-lg text-center border-0 rounded-4 bg-light w-100 h-100 p-4">
              <div className="card-body">
                <h4 className="fw-bold text-dark mb-3">Our Services</h4>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <ul className="list-unstyled fw-semibold text-secondary">
                      <li>Ceramic & Graphene Coatings</li>
                      <li>Paint Protection Films</li>
                      <li>Body-Shop (Denting & Painting)</li>
                      <li>Wrap Jobs</li>
                      <li>Detailing and Interior Cleaning</li>
                      <li>Insurance Claims</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    
                    <ul className="list-unstyled fw-semibold text-secondary">
                      <li>Under-body Anti-Rust Coatings</li>
                      <li>Windshield and Glass Polishing</li>
                      <li>Seat Covers and Door Pad Upholstery</li>
                      <li>Steering, Gear Knob & Gear Bellow Covers</li>
                      <li>7D Mats with Custom Stitching</li>
                      <li>Headlight & Taillight Restorations</li>
                      <li>Body Washing and Vacuuming</li>
                      <li>Headliners Replacement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
