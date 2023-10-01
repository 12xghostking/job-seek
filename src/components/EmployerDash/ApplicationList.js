import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Modal, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ApplicationsList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedJobName, setSelectedJobName] = useState('');
  const [filter, setFilter] = useState('');
  const [applicants, setApplicants] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage] = useState(3); // Number of applicants to show per page

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const employerName = searchParams.get('name');


  useEffect(() => {
    // Fetch applicants for the particular employer
    axios
      .get(`http://localhost:5000/api/employer/applicants?employerName=${employerName}`)
      .then((response) => {
        // Handle the fetched applicants
        setApplicants(response.data);
      })
      .catch((error) => {
        console.error('Error fetching applicants:', error);
      });
  }, [employerName]);

  const handleClose = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const handleShowDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleApprove = (userName, jobAppliedTo) => {
    // Make a POST request to the backend to approve the application
    axios
      .post('http://localhost:5000/approve', { userName, jobAppliedTo })
      .then((response) => {
        // Check if the request was successful (you can add a specific success status code)
        if (response.status === 200) {
          // Update the status of the selected application in the frontend
          const updatedApplications = applicants.map((application) => {
            if (
              application.userName === userName &&
              application.jobAppliedTo === jobAppliedTo
            ) {
              return { ...application, status: 'Accepted' };
            }
            return application;
          });
  
          // Update the applicants state with the modified applications
          setApplicants(updatedApplications);
  
          // Close the modal
          handleClose();
        } else {
          // Handle the case where the request was not successful
          console.error('Error approving application:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error approving application:', error);
      });
  };
  
  const handleReject = (userName, jobAppliedTo) => {
    // Make a POST request to the backend to reject the application
    axios
      .post('http://localhost:5000/reject', { userName, jobAppliedTo })
      .then((response) => {
        // Check if the request was successful (you can add a specific success status code)
        if (response.status === 200) {
          // Update the status of the selected application in the frontend
          const updatedApplications = applicants.map((application) => {
            if (
              application.userName === userName &&
              application.jobAppliedTo === jobAppliedTo
            ) {
              return { ...application, status: 'Rejected' };
            }
            return application;
          });
  
          // Update the applicants state with the modified applications
          setApplicants(updatedApplications);
  
          // Close the modal
          handleClose();
        } else {
          // Handle the case where the request was not successful
          console.error('Error rejecting application:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error rejecting application:', error);
      });
  };
  


  const handleRemove = (userName, jobAppliedTo) => {
    // Make a POST request to the backend to remove the application
    axios
      .post('http://localhost:5000/api/remove-application', { userName, jobAppliedTo })
      .then((response) => {
        // Check if the request was successful (you can add a specific success status code)
        if (response.status === 200) {
          // Remove the selected application from the applicants state
          const updatedApplications = applicants.filter(
            (application) =>
              application.userName !== userName || application.jobAppliedTo !== jobAppliedTo
          );
  
          // Update the applicants state with the modified applications
          setApplicants(updatedApplications);
  
          // Close the modal
          handleClose();
        } else {
          // Handle the case where the request was not successful
          console.error('Error removing application:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error removing application:', error);
      });
  };
  

  const handleDownloadResume = (userName) => {
    // Make a GET request to the server to download the resume file
    axios({
      url: `http://localhost:5000/api/fetch-resume/${userName}`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        // Create a blob URL from the response data
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${userName}_resume.pdf`);
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the blob URL
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading resume:', error);
      });
  };

  const filterApplications = () => {
    // Filter applications based on the selected job name
    const filtered = applicants.filter((application) => {
      if (selectedJobName === '') {
        return true;
      } else {
        return application.jobAppliedTo.toLowerCase().includes(selectedJobName.toLowerCase());
      }
    });

    return filtered;
  };

  // Pagination logic
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filterApplications().slice(indexOfFirstApplicant, indexOfLastApplicant);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <h2>Applications List</h2>

      <Form.Group controlId="jobName">
        <Form.Label>Filter by Job Name:</Form.Label>
        <Form.Control
          type="text"
          value={selectedJobName}
          onChange={(e) => setSelectedJobName(e.target.value)}
          placeholder="Enter job name to filter"
        />
      </Form.Group>

      <div className="applications-list">
        {currentApplicants.map((application) => (
          <Card key={application.id} className="mb-3">
            <Card.Body>
              <Card.Title>{application.userName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {application.jobAppliedTo}
              </Card.Subtitle>
              <Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleShowDetails(application)}
                >
                  Show Details
                </Button>
              </Card.Text>
            </Card.Body>

            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                <strong>Resume:</strong>
                <Button
                  variant="primary"
                  onClick={() => handleDownloadResume(application.userName)}
                >
                  Click to Download
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Pagination>
          {Array.from({ length: Math.ceil(filterApplications().length / applicantsPerPage) }).map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
      {/* Modal to show application details */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <>
              <p><strong>Name:</strong> {selectedApplication.userName}</p>
              <p><strong>Years of Experience:</strong> {selectedApplication.yearsOfExperience}</p>
              <p><strong>Description:</strong> {selectedApplication.description}</p>
              <p><strong>Skills:</strong> {selectedApplication.skills}</p>
              <p><strong>Status:</strong> {selectedApplication.status}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedApplication && selectedApplication.status === 'in review' && (
            <>
              <Button
                variant="success"
                onClick={() => handleApprove(selectedApplication.userName, selectedApplication.jobAppliedTo)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => handleReject(selectedApplication.userName, selectedApplication.jobAppliedTo)}
              >
                Reject
              </Button>

            </>
          )}
          <Button
            variant="danger"
            onClick={()=>handleRemove(selectedApplication.userName, selectedApplication.jobAppliedTo)}
          >
            Remove
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApplicationsList;
