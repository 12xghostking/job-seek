import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Button, Pagination, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const ApplicationsStatus = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userName = queryParams.get('name');

  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(3);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [applications, setApplications] = useState([]); // State to store fetched applications

  // Fetch applications from the backend when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/applicants?userName=${userName}`) // Replace with your backend API URL
      .then((response) => {
        
        setApplications(response.data);
      })
      .catch((error) => {
        console.error('Error fetching applications:', error);
      });
  }, [userName]); // Include userName in the dependency array

    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const filteredApplications = applications.filter((application) =>
      statusFilter ? application.status === statusFilter : true
    );
    const currentApplications = filteredApplications.slice(
      indexOfFirstApplication,
      indexOfLastApplication
    );
  
    // Calculate total pages
    const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);
  
    const handleCloseRemoveModal = () => {
      setShowRemoveModal(false);
      setSelectedApplication(null);
    };
  
    const handleRemove = (application) => {
      setSelectedApplication(application);
      setShowRemoveModal(true);
    };
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const handleStatusFilterChange = (e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1); // Reset to the first page when changing filters
    };
  
    const removeApplication = () => {
      // Send a DELETE request to the backend to remove the application
      axios
        .delete('http://localhost:5000/api/applicants/remove', {
          data: { userName: userName, jobTitle: selectedApplication.jobAppliedTo },
        })
        .then((response) => {
          // Handle success by filtering out the removed application
          const updatedApplications = applications.filter(
            (application) => application.jobAppliedTo !== selectedApplication.jobAppliedTo
          );
    
          setApplications(updatedApplications); // Update the state to reflect the changes
          setShowRemoveModal(false);
        })
        .catch((error) => {
          // Handle error, e.g., display an error message
          console.error('Error removing application:', error);
        });
    };
    
  
    return (
      <>
        <h2>Application Status</h2>
  
        {/* Status Filter */}
        <Form.Group controlId="statusFilter">
          <Form.Label>Filter by Status:</Form.Label>
          <Form.Control
            as="select"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">All</option>
            <option value="In Review">In Review</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </Form.Control>
        </Form.Group>
  
        {currentApplications.map((application) => (
          <Card key={application._id} className="mb-3">
            <Card.Body>
              <Card.Title>{application.jobAppliedTo}</Card.Title>
              <Card.Text>Employer-{application.employerName}</Card.Text>
              <Card.Text>Status: {application.status}</Card.Text>
              <Button
                variant="danger"
                onClick={() => handleRemove(application)}
              >
                Remove
              </Button>
            </Card.Body>
          </Card>
        ))}
  
        {/* Pagination */}
        <Pagination>
          <Pagination.First
            onClick={() => handlePageChange(1)}
          />
          <Pagination.Prev
            onClick={() =>
              handlePageChange(
                currentPage > 1 ? currentPage - 1 : currentPage
              )
            }
          />
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              handlePageChange(
                currentPage < totalPages ? currentPage + 1 : currentPage
              )
            }
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
          />
        </Pagination>
  
        {/* Modal to confirm application removal */}
        <Modal show={showRemoveModal} onHide={handleCloseRemoveModal}>
          <Modal.Header closeButton>
            <Modal.Title>Remove Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedApplication && (
              <>
                <p>
                  Are you sure you want to remove your application for{' '}
                  {selectedApplication.jobAppliedTo}?
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={() => {
                removeApplication();
              }}
            >
              Remove
            </Button>
            <Button variant="secondary" onClick={handleCloseRemoveModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  export default ApplicationsStatus;
 
  
  
  
  