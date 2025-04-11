import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const AllJobsRecruiter = ({ userId }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getAllJobs = async () => {
      if (userId !== undefined) {
        try {
          const res = await axios.get(`http://localhost:8001/api/user/getalljobs/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setJobs(res.data.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getAllJobs(); // Call getAllJobs immediately when component mounts

    // Clean-up function if needed (not needed in this case)
  }, [userId]); // Dependency array should include userId, not getAllJobs

  const removeJob = async (jobId) => {
    try {
      const res = await axios.delete(`http://localhost:8001/api/user/deletejob/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        message.success(res.data.message);
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  return (
    <div className='card-containers'>
      {jobs.length > 0 ? jobs.map((job, i) => (
        <Card key={i} className="card m-3">
          <Card.Header>{job.jobTitle}</Card.Header>
          <Card.Body>
            <Card.Text>
              <b>Location:&nbsp;&nbsp;</b>{job.jobLocation} <br />
              <b>Skills:&nbsp;&nbsp;</b>{job.skills} <br />
              <b>Qualification:&nbsp;&nbsp;</b>{job.qualification} <br />
              <b>No. of Position:&nbsp;&nbsp;</b>{job.position} <br />
              <b>Type:&nbsp;&nbsp;</b>{job.jobType} <br />
              <b>Description:&nbsp;&nbsp;</b>{job.jobDescription}
            </Card.Text>
            <Button style={{ float: 'right' }} onClick={() => removeJob(job._id)} variant="outline-danger">Delete Job</Button>
          </Card.Body>
        </Card>
      )) : <p>No jobs have been posted</p>}
    </div>
  );
}

export default AllJobsRecruiter;
