import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const CreateJobForm = () => {
    const location = useLocation();
    const employerName = new URLSearchParams(location.search).get('name');

    const [jobDetails, setJobDetails] = useState({
        name: '',
        skillsRequired: '',
        location: 'Onsite',
        yearsOfExperience: '<1',
        dateCreated: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobDetails({
            ...jobDetails,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Add the employerName to the jobDetails object
            const jobDetailsWithEmployer = {
                ...jobDetails,
                employerName,
            };

            // Send a POST request to the backend route to create a job
            const response = await axios.post('http://localhost:5000/api/create-job', jobDetailsWithEmployer);

            // Handle a successful response (e.g., show a success message)
            console.log(response.data);

            // Clear the form fields or perform any other necessary actions
            setJobDetails({
                name: '',
                skillsRequired: '',
                location: 'Onsite',
                yearsOfExperience: '',
                dateCreated: '',
                description: '',
            });
        } catch (error) {
            // Handle errors (e.g., show an error message)
            console.error('Error creating job:', error);
        }
    };

    return (
        <><h2>Create Job</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name of Job:</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={jobDetails.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="skillsRequired">
                    <Form.Label>Skills Required:</Form.Label>
                    <Form.Control
                        type="text"
                        name="skillsRequired"
                        value={jobDetails.skillsRequired}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="location">
                    <Form.Label>Location:</Form.Label>
                    <Form.Control
                        as="select"
                        name="location"
                        value={jobDetails.location}
                        onChange={handleChange}
                    >
                        <option value="Onsite">Onsite</option>
                        <option value="Remote">Remote</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="yearsOfExperience">
                    <Form.Label>Years of Experience Requried:</Form.Label>
                    <Form.Control
                        as="select"
                        name="yearsOfExperience"
                        value={jobDetails.yearsOfExperience}
                        onChange={handleChange}
                    >
                        <option value="<1">0-1</option>
                        <option value="1-3">1-3</option>
                        <option value="3-5">3-5</option>
                        <option value="5+">5+</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="dateCreated">
                    <Form.Label>Date Created:</Form.Label>
                    <Form.Control
                        type="text"
                        name="dateCreated"
                        value={jobDetails.dateCreated}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={jobDetails.description}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Create Job
                </Button>
            </Form></>
    );
};

export default CreateJobForm;
