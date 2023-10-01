import React, { useState,useEffect } from 'react';
import { Card, Button, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const ApplicationApproval = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage] = useState(3);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const employerName = searchParams.get('name');
  useEffect(() => {
    // Fetch approved applications by employer name (replace 'yourEmployerName' with the actual employer name)
    axios
      .get(`https://job-seeker-nb9v.onrender.com/api/approved-applications?employerName=${employerName}`)
      .then((response) => {
        console.log('Approved applications:', response.data);
        setApprovedApplications(response.data);
      })
      .catch((error) => {
        console.error('Error fetching approved applications:', error);
      });
  }, []); // Number of applicants to show per page

  const handleClose = () => {
    setShowModal(false);
    setSelectedApplicant(null);
  };

  const handleRemove = () => {
    if (!selectedApplicant) {
      return;
    }
  
    // Make a POST request to remove the application
    axios
      .post('https://job-seeker-nb9v.onrender.com/api/remove-application', {
        userName: selectedApplicant.userName,
        jobAppliedTo: selectedApplicant.jobAppliedTo,
      })
      .then((response) => {
        // Handle success, e.g., show a notification
  
        // Fetch the updated list of approved applications
        axios
          .get(`https://job-seeker-nb9v.onrender.com/api/approved-applications?employerName=${employerName}`)
          .then((response) => {
            console.log('Updated approved applications:', response.data);
            setApprovedApplications(response.data);
          })
          .catch((error) => {
            console.error('Error fetching updated approved applications:', error);
          });
  
        handleClose();
      })
      .catch((error) => {
        console.error('Error removing application:', error);
      });
  };
  
  const handleApprove = () => {
    if (!selectedApplicant) {
      return;
    }
  
    // Make a POST request to approve the application
    axios
      .post('https://job-seeker-nb9v.onrender.com/api/approve-application', {
        userName: selectedApplicant.userName,
        jobAppliedTo: selectedApplicant.jobAppliedTo,
      })
      .then((response) => {
        // Handle success, e.g., show a notification
  
        // Fetch the updated list of approved applications
        axios
          .get(`https://job-seeker-nb9v.onrender.com/api/approved-applications?employerName=${employerName}`)
          .then((response) => {
            console.log('Updated approved applications:', response.data);
            setApprovedApplications(response.data);
          })
          .catch((error) => {
            console.error('Error fetching updated approved applications:', error);
          });
  
        handleClose();
      })
      .catch((error) => {
        console.error('Error approving application:', error);
      });
  };
  
  
  // Pagination logic
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = approvedApplications.slice(indexOfFirstApplicant, indexOfLastApplicant);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <h2>Approved Applications</h2>

      <div className="approved-applications-list">
        {currentApplicants.map((applicant) => (
          <Card key={applicant.id} className="mb-3">
            <Card.Body>
              <Card.Title>{applicant.userName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Job: {applicant.jobAppliedTo}</Card.Subtitle>
              <Card.Text>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedApplicant(applicant);
                    setShowModal(true);
                  }}
                >
                  Further Steps
                </Button>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Pagination>
          {Array.from({ length: Math.ceil(approvedApplications.length / applicantsPerPage) }).map((_, index) => (
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

      {/* Modal for further steps */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Further Steps</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplicant && (
            <>
              <p>Choose the further steps for {selectedApplicant.name}:</p>
              <Button
                variant="success"
                className="mb-2"
                onClick={() => {
                  handleApprove();
                }}
              >
                Approve and Remove from List
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleRemove();
                }}
              >
                Remove from Consideration
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApplicationApproval;
