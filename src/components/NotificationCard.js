import React from 'react';

const NotificationCard = ({ notification }) => {
  if (!notification) {
    return <div className="notification-card">No notification available</div>;
  }

  return (
    <div className="notification-card">
      <h4>{notification.title}</h4>
      <p>{notification.message}</p>
      <small>{notification.timestamp}</small>
    </div>
  );
}

export default NotificationCard;
