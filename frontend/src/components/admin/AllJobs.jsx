import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import { message } from 'antd';

const Alljobs = () => {

   const [allJobs, setAllJobs] = useState([])

   const getAllJobs = async() => {
      try {
         const res = await axios.get('http://localhost:8001/api/admin/getalljobsadmin',{
            headers:{Authorization : `Bearer ${localStorage.getItem("token")}`},
         })
         if(res.data.success){
            setAllJobs(res.data.data)
         }
      } catch (error) {
         console.log(error);
         message.error('Something went wrong');
      }
   }
   useEffect(()=>{
      getAllJobs()
   },[])

   const handleStatus = async(jobId) => {
      try {
         const res = await axios.delete(`http://localhost:8001/api/admin/jobdelete/${jobId}`,{
            headers:{Authorization : `Bearer ${localStorage.getItem("token")}`},
         },)
         if(res.data.success){
            message.success(res.data.message)
            getAllJobs()
         }
         else{
            message.error(res.data.message)
         }
      } catch (error) {
         console.log(error);
         message.error('Something went wrong');
      }
   }
   return (
      <div className='w-100'>
         <MDBTable striped>
            <MDBTableHead>
               <tr>
                  <th scope='col'>Job ID</th>
                  <th scope='col'>Recruiter ID</th> 
                  <th scope='col'>Job Title</th>
                  <th scope='col'>Job Location</th>
                  <th scope='col'>Position</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Action</th>
               </tr>
            </MDBTableHead>
            <MDBTableBody>
               {allJobs && allJobs.map((job) => {
                  return (
                     <tr key={job._id}>
                        <th scope='row'>{job._id}</th>
                        <td>{job.recruiterId}</td>
                        <td>{job.jobTitle || 'N/A'}</td>
                        <td>{job.jobLocation}</td>
                        <td>{job.position}</td>
                        <td>{job.status}</td>
                        <td><Button onClick={() => handleStatus(job._id)} size='sm' className='mx-2' variant='outline-danger'>Delete the Job</Button></td>
                     </tr>
                  );
               })}
            </MDBTableBody>
         </MDBTable>
         <p>You have {allJobs.length} jobs in the app.</p>
      </div>
   )
}

export default Alljobs
