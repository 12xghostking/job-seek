import React from 'react';
import Header from './Header'; // Import your Header component
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import JobList from './JobList';
import CreateJobForm from './CreateJobForm';
import ApplicationList from './ApplicationList';
import ApplicationApproval from './ApplicationApproval';
import Notifications from './Notification';

const EmployerDashboard = () => {
  return (
    <>
      <Header />
      <br></br>
      <Container>
        <Row>
          <JobList />
        </Row>
        <br></br>
        <Row>
          <CreateJobForm />
        </Row>
        <br></br>
        <Row>
          <ApplicationList />
        </Row>
        <br></br>
        <Row>
          <ApplicationApproval />


        </Row>
        <Row>
          <Notifications />
        </Row> 
      </Container>
    </>
  );
};

export default EmployerDashboard;
