import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const CallToAction = () => {
  return (
    <Card className="text-center">
      <Card.Body>
        <Card.Title>Ready to get started?</Card.Title>
        <Card.Text>Create an account or log in to access all the features.</Card.Text>
        <div className="my-3">
          <Button as={Link} to="/signup" variant="primary" size="lg" className="mr-2">
            Sign Up
          </Button>
          <Button as={Link} to="/login" variant="outline-primary" size="lg">
            Login
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CallToAction;
