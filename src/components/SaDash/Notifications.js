import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('name');
  useEffect(() => {
    // Fetch notifications for the specific user (replace with your API URL)
    axios
      .get(`https://job-seeker-nb9v.onrender.com/api/notifications/${username}`)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  }, [username]);

  const handleRemoveNotification = (description, username) => {
    // Send a DELETE request to remove notifications by description and username
    axios
      .delete('https://job-seeker-nb9v.onrender.com/api/notifications/remove', {
        data: { description, username },
      })
      .then((response) => {
        // Handle success, e.g., show a success message or update the notifications list
        alert('Notifications removed successfully.');
        const updatedNotifications = notifications.filter(
          (notification) =>
            notification.description !== description ||
            notification.receivedBy !== username
        );
        setNotifications(updatedNotifications);
      })
      .catch((error) => {
        // Handle error, e.g., display an error message
        console.error('Error removing notifications:', error);
      });
  };
  

  return (
    <>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          variant="info"
          className="mb-3 d-flex justify-content-between align-items-center"
        >
          <div>
            <div>{notification.description}</div>
            <div>Received From: {notification.receivedFrom}</div>
          </div>
          <Button
            variant="danger"
            size="sm"
            className="float-right"
            onClick={() => handleRemoveNotification(notification.description, notification.receivedBy)}
          >
            X
          </Button>
        </Alert>
      ))}
    </>
  );
};

export default Notifications;
