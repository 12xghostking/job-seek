import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the name query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const employerName = queryParams.get('name') || 'Dummy Employer';

  const handleLogout = () => {
    // Redirect to the landing page
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>{employerName}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
