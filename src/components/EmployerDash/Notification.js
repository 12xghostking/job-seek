import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Notifications = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [notification, setNotification] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const employerName = searchParams.get('name');

  useEffect(() => {
    // Fetch job seekers for the particular employer
    axios
      .get(`http://localhost:5000/api/employers/jobseekers?employerName=${employerName}`)
      .then((response) => {
        // Extract the userName values from the response data
        const userNames = response.data.map((jobSeeker) => jobSeeker.userName);
  
        // Create a Set to store unique userNames
        const uniqueUserNames = new Set(userNames);
  
        // Convert the Set back to an array
        const uniqueJobSeekersArray = Array.from(uniqueUserNames).map((userName) => ({
          userName,
        }));
  
        setJobSeekers(uniqueJobSeekersArray);
      })
      .catch((error) => {
        console.error('Error fetching job seekers:', error);
      });
  }, [employerName]);
  
  

  const handleJobSeekerSelect = (jobSeeker) => {
    setSelectedJobSeeker(jobSeeker);
  };

  const handleNotificationChange = (e) => {
    setNotification(e.target.value);
  };

  const handleSendNotification = () => {
    // Check if a job seeker is selected and a notification message is provided
    if (selectedJobSeeker && notification) {
      // Send the notification to the selected job seeker
      axios
        .post('http://localhost:5000/api/notifications/send', {
          description: notification,
          receivedFrom: employerName, // Replace with the actual employer name
          receivedBy: selectedJobSeeker.userName,
        })
        .then((response) => {
          // Handle success, e.g., show a success message
          alert('Notification sent successfully.');
          setNotification('');
        })
        .catch((error) => {
          // Handle error, e.g., display an error message
          console.error('Error sending notification:', error);
        });
    }
  };

  return (
    <>
      <h2>Notifications</h2>

      <Form>
        <Form.Group controlId="jobSeeker">
          <Form.Label>Select Job Seeker:</Form.Label>
          <DropdownButton
            id="dropdown-job-seeker"
            title={selectedJobSeeker ? selectedJobSeeker.userName : 'Select Job Seeker'}
          >
            {jobSeekers.map((jobSeeker) => (
              <Dropdown.Item
                key={jobSeeker.userName} // Provide a unique key
                onClick={() => handleJobSeekerSelect(jobSeeker)}
              >
                {jobSeeker.userName}
              </Dropdown.Item>
            ))}

          </DropdownButton>
        </Form.Group>

        <Form.Group controlId="notification">
          <Form.Label>Notification Message:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={notification}
            onChange={handleNotificationChange}
            placeholder="Enter your notification message here"
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSendNotification}>
          Send Notification
        </Button>
      </Form>
    </>
  );
};

export default Notifications;
