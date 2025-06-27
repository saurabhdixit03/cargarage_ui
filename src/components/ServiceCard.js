import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <p>Price: ${service.price}</p>
      <button className="book-now-btn">Book Now</button>
    </div>
  );
}

export default ServiceCard;
