import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { Col, Form, Input, Row, message } from 'antd';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';

const AllJobsSeeker = () => {
  const [resume, setResume] = useState(null);
  const [allApplication, setAllApplication] = useState([]);
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    universityName: '',
    degree: '',
    experience: '',
    resume: null,
  });

  const userLoggedIn = !!localStorage.getItem('userData');
  const [jobs, setJobs] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const allJobs = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/user/alljobs');
      setJobs(res.data.data);
    } catch (error) {
      console.log('Error fetching jobs:', error);
    }
  };

  const getAllApplications = async () => {
    try {
      const userdata = JSON.parse(localStorage.getItem('userData'));
      if (!userdata || !userdata._id) {
        return;
      }
      const res = await axios.get(`http://localhost:8001/api/user/getallapplications/${userdata._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (res.data.success) {
        setAllApplication(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching applications:', error);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    allJobs();
    getAllApplications();
  }, []);

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (jobId) => {
   try {
     const userId = JSON.parse(localStorage.getItem('userData'))._id;
     const formData = new FormData();
     formData.append('name', details.name);
     formData.append('phone', details.phone);
     formData.append('email', details.email);
     formData.append('address', details.address);
     formData.append('universityName', details.universityName);
     formData.append('degree', details.degree);
     formData.append('experience', details.experience);
     formData.append('resume', resume);
     formData.append('userId', userId); // Ensure userId is included in formData
 
     const res = await axios.post(`http://localhost:8001/api/user/applyjob/${jobId}`, formData, {
       headers: {
         Authorization: `Bearer ${localStorage.getItem('token')}`,
         'Content-Type': 'multipart/form-data',
       },
     });
 
     if (res.data.success) {
       message.success(res.data.message);
       // Reset form and resume after successful submission
       setDetails({
         name: '',
         email: '',
         phone: '',
         address: '',
         universityName: '',
         degree: '',
         experience: '',
         resume: null,
       });
       setResume(null);
       setModalVisible(false); // Close modal after submission
     } else {
       message.error(res.data.message);
     }
   } catch (error) {
     console.error('Error applying for job:', error);
     message.error('Something went wrong while applying');
   }
 };
 

  const openModal = (jobId) => {
    setSelectedJobId(jobId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedJobId(null);
    setModalVisible(false);
  };

  return (
    <Container className="second-container">
      <div className=" mt-4 filter-container text-center">
        <p className="mt-3">Filter By: </p>
        <input
          type="text"
          placeholder=": Job Title"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder=": Job Location"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Mid-Senior Level">Mid-Senior Level</option>
          <option value="Internship">Internship</option>
        </select>
      </div>
      <div className="d-flex mt-5">
        {jobs && jobs.length > 0 ? (
          jobs
            .filter((job) => filterTitle === '' || job.jobTitle.toLowerCase().includes(filterTitle.toLowerCase()))
            .filter((job) => filterLocation === '' || job.jobLocation.toLowerCase().includes(filterLocation.toLowerCase()))
            .filter((job) => filterType === '' || job.jobType.includes(filterType))
            .map((job) => (
              <Card border="warning" key={job._id} style={{ width: '18rem', marginLeft: 10 }}>
                <Card.Body>
                  <Card.Title><b>{job.jobTitle}</b></Card.Title>
                  <Card.Text>
                    <p style={{ fontWeight: 600 }} className='my-1'>Location:</p> {job.jobLocation} <br />
                    <p style={{ fontWeight: 600 }} className='my-1'>Position:</p> {job.position} <br />
                    <p style={{ fontWeight: 600 }} className='my-1'>Type:</p> {job.jobType} <br />
                    <p style={{ fontWeight: 600 }} className='my-1'>Job Status:</p> {job.status} <br />
                    <p style={{ fontWeight: 600 }} className='my-1'>People applied:</p> {job.count}<br />
                    <p style={{ float: 'right', fontSize: 12, color: 'orange' }}>For more details, click on Apply Now</p>
                  </Card.Text>
                  {allApplication.some((app) => (app.jobInfo._id === job._id) && (app.status === 'applied' || app.status === 'rejected' || app.status === 'selected')) ? (
                    <p style={{ float: 'right', color: 'grey' }} variant="warning" disabled>
                      Already Applied
                    </p>
                  ) : userLoggedIn ? (
                    <Button
                      style={{ float: 'right' }}
                      variant="outline-warning"
                      onClick={() => openModal(job._id)}
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <Button style={{ float: 'right' }} variant="outline-warning">
                      <Link to={'/login'}>Apply Now</Link>
                    </Button>
                  )}
                  <Modal
                    centered
                    visible={modalVisible && selectedJobId === job._id}
                    onOk={() => handleSubmit(job._id)}
                    onCancel={closeModal}
                    width={1000}
                  >
                    <Form>
                      <h3>Job Description and Skills</h3><hr />
                      <div className="d-flex flex-column mt-0">
                        <h5>Description:</h5><p>{job.jobDescription}</p><br />
                        <h5>Skills:</h5><p>{job.skills}</p><br />
                      </div>
                      <hr style={{ height: 3, background: 'black' }} />
                      <h3>Enter Your Details for the Application</h3><hr />
                      <h5>Personal Details:</h5>
                      <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="Full Name" required>
                            <Input name='name' value={details.name} onChange={handleChange} placeholder='Enter name' />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="Phone" required>
                            <Input name='phone' value={details.phone} onChange={handleChange} type='number' placeholder='Your phone' />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="Email" required>
                            <Input name='email' value={details.email} onChange={handleChange} type='email' placeholder='Your email' />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="Address" required>
                            <Input name='address' value={details.address} onChange={handleChange} type='text' placeholder='Your address' />
                          </Form.Item>
                        </Col>
                      </Row>
                      <h5>Highest Educational Details:</h5>
                      <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="University Name" required>
                            <Input name='universityName' value={details.universityName} onChange={handleChange} type='text' placeholder='Your university name' />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="Highest Degree" required>
                            <Input name='degree' value={details.degree} onChange={handleChange} type='text' placeholder='Your highest degree' />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="Experience" required>
                            <Input name='experience' value={details.experience} onChange={handleChange} type='number' placeholder='Your experience' />
                          </Form.Item>
                        </Col>
                      </Row>
                      <h5>Resume (only in Pdf Format):</h5>
                      <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="Resume" required>
                            <Input name='resume' accept="application/pdf" onChange={handleDocumentChange} type='file' />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                          <Button onClick={closeModal} style={{ marginRight: 10 }}>
                            Cancel
                          </Button>
                          <Button type='primary' onClick={() => handleSubmit(job._id)}>
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Modal>
                </Card.Body>
              </Card>
            ))
        ) : (
          <p>No jobs available at the moment</p>
        )}
      </div>
    </Container>
  );
};

export default AllJobsSeeker;
