import { message } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';

const AllApplicaints = ({ userId }) => {
   const [allApplicants, setAllApplicants] = useState([])

   const getdata = async () => {
      if (userId !== undefined) {
         try {
            const res = await axios.get(`http://localhost:8001/api/user/getapplicant_recruiter/${userId}`, {
               headers: {
                  Authorization: "Bearer " + localStorage.getItem('token')
               },
            })
            if (res.data.success) {
               setAllApplicants(res.data.data)
            }
         } catch (error) {
            console.log(error);
            message.error('Something went wrong');
         }
      }
   }

   useEffect(() => {
      getdata()
   }, [])

   const handleDownload = async (url, applicationId) => {
      try {
         const res = await axios.get('http://localhost:8001/api/user/getresumedownload', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            params: { applicationId },
            responseType: 'blob'
         });
         console.log(res.data)
         if (res.data) {
            const fileUrl = window.URL.createObjectURL(new Blob([res.data], { "type": "application/pdf" }));
            const downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);
            downloadLink.setAttribute("href", fileUrl);

            // Extract the file name from the url parameter
            const fileName = url.split("/").pop(); // Assuming the URL is in the format "uploads/document.pdf"

            console.log(fileUrl, downloadLink, fileName)
            // Set the file name for the download
            downloadLink.setAttribute("download", fileName);
            downloadLink.style.display = "none";
            downloadLink.click();
         } else {
            message.error(res.data.error);
         }
      } catch (error) {
         console.log(error);
         message.error('Something went wrong');
      }
   };

   const handleStatus = async(applicationId, status) => {
      try {
         const res = await axios.post('http://localhost:8001/api/user/handlestatus',{
            applicationId,
            status,
         },{
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
         })
         if(res.data.success){
            message.success(res.data.message)
            getdata()
         }else {
            message.error(res.data.error);
         }
      }
      catch (error) {
         console.log(error);
         message.error('Something went wrong');
      }
   }
   return (
      <div className='w-100'>
         <MDBTable striped>
            <MDBTableHead>
               <tr>
                  <th scope='col'>Application ID</th>
                  <th scope='col'>Job Title</th>
                  <th scope='col'>Applicant Name</th>
                  <th scope='col'>Applicant email</th>
                  <th scope='col'>Applicant Phone</th>
                  <th scope='col'>Resume</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Action</th>
               </tr>
            </MDBTableHead>
            <MDBTableBody>
               {allApplicants && allApplicants.map((application) => {
                  return (
                     <tr key={application._id}>
                        <th scope='row'>{application._id}</th>
                        <td>{application.jobInfo?.jobTitle || 'N/A'}</td>
                        <td>{application.name}</td>
                        <td>{application.email}</td>
                        <td>{application.phone}</td>
                        <td><td><Button variant='link' onClick={() => handleDownload(application.resume.path, application._id)}>{application.resume.filename}</Button></td></td>
                        <td>{application.status}</td>
                        <td><Button onClick={()=> handleStatus(application._id, 'rejected')} size='sm' className='mx-2' variant='outline-danger'>Reject</Button><Button onClick={()=> handleStatus(application._id, 'selected')} size='sm' variant='outline-success'>Approve</Button></td>
                     </tr>
                  );
               })}
            </MDBTableBody>
         </MDBTable>
         <p>You have {allApplicants.length} applicants for the jobs.</p>
      </div>
   )
}

export default AllApplicaints
