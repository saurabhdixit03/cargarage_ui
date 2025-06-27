import React from 'react';

const CustomCard = ({ children, customerType }) => {
  const cardStyle = {
    backgroundColor: customerType === 'REPEAT' ? '#e8f5e9' : '#e3f2fd',
    border: '1px solid #ccc',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  };

  return <div style={cardStyle}>{children}</div>;
};

export default CustomCard;

