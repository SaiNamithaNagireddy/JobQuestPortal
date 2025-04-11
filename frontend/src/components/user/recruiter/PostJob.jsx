import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { InputNumber, Slider, message } from 'antd';
import axios from 'axios';

const PostJob = ({userId}) => {
  const [inputValue, setInputValue] = useState(1);
  const [postJob, setPostJob] = useState({
    jobTitle: '',
    jobLocation: '',
    skills: '',
    qualification: '',
    jobDescription: '',
    position: 1,
    jobType: 'Select Type',
  });

  const handleChange = (e) => {
    setPostJob({ ...postJob, [e.target.name]: e.target.value });
  };

  const handlePositionChange = (newValue) => {
    setInputValue(newValue);
    setPostJob({ ...postJob, position: newValue });
  };

  const handleJobTypeChange = (e) => {
    setPostJob({ ...postJob, jobType: e.target.value });
  };

  const postingJob = async () => {
    
    const jobData = {...postJob, recruiterId: userId}
    try {
      const res = await axios.post('http://localhost:8001/api/user/jobposting',jobData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (res.data.success) {
        message.success(res.data.message)
      }
      else {
        message.error(res.data.success)
      }
    } catch (error) {
      console.log(error)
      message.error('Something went wrong')
    }
  };

  return (
    <div>
      <Form onSubmit={postingJob} className="mb-3">
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Control name='jobTitle' value={postJob.jobTitle} onChange={handleChange} type="text" placeholder="Enter Job Title" required />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridLocation">
            <Form.Label>Job Location</Form.Label>
            <Form.Control name='jobLocation' value={postJob.jobLocation} onChange={handleChange} type="text" placeholder="Enter Job Location" required />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Skills</Form.Label>
          <Form.Control name='skills' value={postJob.skills} onChange={handleChange} required placeholder="Enter skills set" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress2">
          <Form.Label>Qualification</Form.Label>
          <Form.Control name='qualification' value={postJob.qualification} onChange={handleChange} required as={"textarea"} placeholder="Enter qaulification" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress2">
          <Form.Label>Job Description</Form.Label>
          <Form.Control name='jobDescription' value={postJob.jobDescription} onChange={handleChange} required as={"textarea"} placeholder="Enter Job description" />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridposition">
            <Form.Label>No. of position</Form.Label>
            <Slider
              min={1}
              max={20}
              onChange={handlePositionChange}
              value={typeof inputValue === 'number' ? inputValue : 0}
            />
            <InputNumber
              min={1}
              max={20}
              style={{
                margin: '0 16px',
              }}
              value={inputValue}
              onChange={handlePositionChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridJobType">
            <Form.Label>Job Type</Form.Label>
            <Form.Select value={postJob.jobType} onChange={handleJobTypeChange}>
              <option>Select Type</option>
              <option>Entry Level</option>
              <option>Mid-Senior Level</option>
              <option>Internship</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default PostJob;














