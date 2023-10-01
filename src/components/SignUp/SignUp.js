import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import img1 from './image1.png';
import axios from 'axios';
const SignUp = () => {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password length validation
    if (password.length < 5) {
      setShowError(true);
      setErrorMessage('Password must be at least 5 characters long.');
      return; // Prevent further execution
    }
    
    // Password matching validation
    if (password !== confirmPassword) {
      setShowError(true);
      setErrorMessage('Passwords do not match.');
      return; // Prevent further execution
    }
    try {
      const response = await axios.post('https://job-seeker-nb9v.onrender.com/api/signup', {
        role,
        name,
        email,
        password,
      });

      // Handle successful registration, e.g., redirect to login page
      console.log(response.data.message);
      navigate('/login');
    } catch (error) {
      // Handle registration error, e.g., display an error message
      console.error(error.response.data.error);
      setShowError(true);
      setErrorMessage(error.response.data.error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setRole(value);
    } else if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease-in-out',
            maxWidth: '400px',
            width: '100%',
            position: 'relative',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
        >
          <div className="d-flex justify-content-center">
            <Form onSubmit={handleSubmit} className="w-100">
              <h2>Sign Up</h2>
              {showError && (
                <Alert variant="danger">
                  {errorMessage}
                </Alert>
              )}
              <Form.Group controlId="role">
                <Form.Label>Role:</Form.Label>
                <Form.Control as="select" value={role} onChange={handleInputChange} name="role">
                  <option value="user">User</option>
                  <option value="employer">Employer</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="text" value={name} onChange={handleInputChange} name="name" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" value={email} onChange={handleInputChange} name="email" />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" value={password} onChange={handleInputChange} name="password" />
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control type="password" value={confirmPassword} onChange={handleInputChange} name="confirmPassword" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
