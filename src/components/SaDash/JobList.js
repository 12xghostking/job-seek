import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Card, Button, Modal, Form, Pagination } from 'react-bootstrap';
import { useLocation } from 'react-router-dom'; // Import useLocation

const JobList = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState('');
  const [jobs, setJobs] = useState([]); // State to store fetched jobs
  const [applicantDetails, setApplicantDetails] = useState({
    // Remove userName field
    skills: '',
    description: '',
    jobAppliedTo: '', // Store the job name here
    employerName: '', // Get the employer name from the job details
    yearsOfExperience: '<1', // Default value for years of experience
  });
  const jobsPerPage = 3;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Fetch jobs from the backend when the component mounts
    axios
      .get('http://localhost:5000/api/jobs') // Replace with your backend API URL
      .then((response) => {
        
        setJobs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  // Filter jobs based on location and pagination
  const filteredJobs = jobs.filter((job) => {
    const locationMatch =
      !locationFilter || job.location.includes(locationFilter);
    return locationMatch;
  });

  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApply = (job) => {
    // Set applicant details before showing the apply modal
    setApplicantDetails({
      ...applicantDetails,
      jobAppliedTo: job.name,
      employerName: job.employerName,
    });

    setShowApplyModal(true);
  };

  const handleApplicantInputChange = (e) => {
    const { name, value } = e.target;
    setApplicantDetails({
      ...applicantDetails,
      [name]: value,
    });
  };

  const handleSubmitApplication = () => {
    axios
      .post('http://localhost:5000/api/applicants/apply', applicantDetails) // Replace with your backend API URL
      .then((response) => {
        // Handle success, e.g., show a success message or close the modal
        alert('Application submitted successfully.');
        setShowApplyModal(false);
      })
      .catch((error) => {
        // Handle error, e.g., display an error message
        console.error('Error submitting application:', error);
      });
  };

  // Extract the username from the URL query using a custom function
  const getUsernameFromQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('name') || '';
  };

  // Automatically populate the username
  useEffect(() => {
    setApplicantDetails({
      ...applicantDetails,
      userName: getUsernameFromQuery(),
    });
  }, [location.search]); // Update when the query parameter changes

  return (
    <>
      <h2>Job List</h2>

      {/* Filters */}
      <Form.Group controlId="locationFilter">
        <Form.Label>Filter by Location:</Form.Label>
        <Form.Control
          as="select"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Onsite">Onsite</option>
          <option value="Remote">Remote</option>
        </Form.Control>
      </Form.Group>

      {/* Jobs */}
      {currentJobs.map((job) => (
        <Card key={job._id} className="mb-3">
          <Card.Body>
            <Card.Title>{job.name}</Card.Title>
            <Card.Text>Skills Required: {job.skillsRequired}</Card.Text>
            <Card.Text>Years of Experience: {job.yearsOfExperience}</Card.Text>
            <Card.Text>Location: {job.location}</Card.Text>
            <Card.Text>Employer: {job.employerName}</Card.Text>
            <Card.Text>Description: {job.description}</Card.Text>
            <Button variant="primary" onClick={() => handleApply(job)}>
              Apply
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* Pagination */}
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} />
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
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </Pagination>

      {/* Modal for Applying */}
      <Modal show={showApplyModal} onHide={handleCloseApplyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Apply for {selectedJob?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Remove the username field */}
            <Form.Group controlId="skills">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                value={applicantDetails.skills}
                onChange={handleApplicantInputChange}
              />
            </Form.Group>
            <Form.Group controlId="yearsOfExperience">
              <Form.Label>Years of Experience</Form.Label>
              <Form.Control
                as="select"
                name="yearsOfExperience"
                value={applicantDetails.yearsOfExperience}
                onChange={handleApplicantInputChange}
              >
                <option value="<1">0-1</option>
                <option value="1-3">1-3</option>
                <option value="3-5">3-5</option>
                <option value="5+">5+</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={applicantDetails.description}
                onChange={handleApplicantInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmitApplication}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default JobList;
