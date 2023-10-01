import React, { useState, useEffect } from 'react';
import { ListGroup, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [showJobDetails, setShowJobDetails] = useState({});
  const [showCloseJobOverlay, setShowCloseJobOverlay] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [totalApplicants, setTotalApplicants] = useState({});

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const employerName = searchParams.get('name');
  const [openJobId, setOpenJobId] = useState(null);

  useEffect(() => {
    // Fetch jobs for the particular employer
    axios
      .get(`https://job-seeker-nb9v.onrender.com/api/emp/jobs?employerName=${employerName}`)
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
      });
  }, [employerName]);

  useEffect(() => {
    // Fetch the total number of applicants for each job
    const fetchTotalApplicants = async () => {
      const promises = jobs.map(async (job) => {
        try {
          const response = await axios.get(`https://job-seeker-nb9v.onrender.com/api/jobs/${job.name}/applicants`);
          const { totalApplicants } = response.data;
          setTotalApplicants((prevState) => ({
            ...prevState,
            [job.name]: totalApplicants,
          }));
        } catch (error) {
          console.error(`Error fetching total applicants for ${job.name}:`, error);
        }
      });

      await Promise.all(promises);
    };

    fetchTotalApplicants();
  }, [jobs]);

  const toggleJobDetails = (jobId) => {
    setOpenJobId(jobId);
    setShowJobDetails((prevState) => ({
      ...prevState,
      [jobId]: !prevState[jobId],
    }));
  };

  const toggleCloseJobOverlay = () => {
    setShowCloseJobOverlay(!showCloseJobOverlay);
  };

  const closeJob = (jobName) => {
    // Send a DELETE request to remove the job
    axios
      .delete('https://job-seeker-nb9v.onrender.com/api/jobs/remove', {
        data: { jobName, employerName },
      })
      .then((response) => {
        // Handle success by filtering out the removed job
        const updatedJobs = jobs.filter((job) => job.name !== jobName);
        setJobs(updatedJobs);
        setShowCloseJobOverlay(false);
        setOpenJobId(null);
      })
      .catch((error) => {
        // Handle error, e.g., display an error message
        console.error('Error removing job:', error);
      });
  };

  return (
    <div>
      <h2>Job List for {employerName}</h2>
      <ListGroup>
        {jobs.map((job) => (
          <ListGroup.Item
            key={job.id}
            onClick={() => toggleJobDetails(job.id)}
            action
          >
            {job.name}
            <div>
              <span>Total Applicants: {totalApplicants[job.name] || 0}</span>
              <Button
                variant="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCloseJobOverlay();
                  setSelectedJob(job.name);
                }}
                style={{ float: 'right' }}
              >
                Close Job
              </Button>
            </div>
            {openJobId === job.id && showJobDetails[job.id] && (
              <p>{job.description}</p>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showCloseJobOverlay} onHide={toggleCloseJobOverlay}>
        <Modal.Header closeButton>
          <Modal.Title>Close Job?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleCloseJobOverlay}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => closeJob(selectedJob)}>
            Confirm Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobList;
