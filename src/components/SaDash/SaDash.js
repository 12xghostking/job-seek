import React from 'react';
import Header from './Header'; // Import your Header component
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 import ResumeUpload from './ResumeUpload'; // Import your ResumeUpload component
import JobList from './JobList'; // Import your JobList component
 import ApplicationStatus from './ApplicationStatus'; // Import your ApplicationStatus component
import Notifications from './Notifications.js'; // Import your Notifications component

const SeekerDashboard = () => {
    return (
        <>
            <Header />
            <br />
            <Container>
                <Row> <Notifications /> </Row>
                <Row>

                    <ResumeUpload />

                </Row>
                <br />
                <Row>

                    <JobList />

                </Row>
                <br />
                <Row>
                    <ApplicationStatus />
                </Row>
            </Container>
        </>
    );
};

export default SeekerDashboard;
