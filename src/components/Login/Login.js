import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header'; // Import your Header component
import img1 from './image1.png'; // Replace 'your-image-path' with the actual image path
import axios from 'axios';

const Login = () => {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

 
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post('https://job-seeker-nb9v.onrender.com/api/login', {
          role,
          email,
          password,
        });
  
        const { userId, name } = response.data;
  
        if (role === 'user') {
          navigate(`/seeker?name=${name}`);
        } else if (role === 'employer') {
          navigate(`/employer?name=${name}`);
        }
      } catch (error) {
        // Handle login error
        setShowError(true);
        setErrorMessage('Invalid email or password. Please try again.');
      }
    };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'role') {
      setRole(value);
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
            position: 'relative', // Set position to enable hover animation
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
        >
          <div className="d-flex justify-content-center">
            <Form onSubmit={handleSubmit} className="w-100">
              <h2>Login</h2>
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
              <Form.Group controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" value={email} onChange={handleInputChange} name="email" />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" value={password} onChange={handleInputChange} name="password" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
