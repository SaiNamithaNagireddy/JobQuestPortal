import { message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';

const RecruiterStatus = () => {
   const [recruitUser, setRecruitUser] = useState([]);

   const fecthingAllRecruiters = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/admin/getallrecruiterdata', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         });
         if (res.data.success) {
            setRecruitUser(res.data.data);
         }
      } catch (error) {
         console.log(error);
         message.error('something went wrong');
      }
   };

   useEffect(() => {
      fecthingAllRecruiters();
   }, []);

   const refreshToken = async () => {
      try {
         const response = await axios.post('http://localhost:8001/api/auth/refresh', {
            token: localStorage.getItem('refreshToken')
         });
         localStorage.setItem('token', response.data.token);
         return response.data.token;
      } catch (error) {
         console.error('Error refreshing token:', error);
         throw error;
      }
   };

   const handleApprove = async (recruiterId, status, userid) => {
      console.log(recruiterId, status, userid);
      try {
         let token = localStorage.getItem('token');
         let res = await axios.post('http://localhost:8001/api/admin/getapprove', 
            { recruiterId, status, userid }, 
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

         if (res.data.success) {
            message.success('Recruiter approved successfully');
            fecthingAllRecruiters();
         } else {
            message.error('Failed to approve recruiter');
         }

         console.log('Response:', res.data);
      } catch (error) {
         if (error.response && error.response.data.message === 'Token is not valid') {
            try {
               const newToken = await refreshToken();
               const res = await axios.post('http://localhost:8001/api/admin/getapprove', 
                  { recruiterId, status, userid }, 
                  {
                     headers: {
                        Authorization: `Bearer ${newToken}`,
                     },
                  });

               if (res.data.success) {
                  message.success('Recruiter approved successfully');
                  fecthingAllRecruiters();
               } else {
                  message.error('Failed to approve recruiter');
               }

               console.log('Response after token refresh:', res.data);
            } catch (refreshError) {
               console.error('Error after refreshing token:', refreshError);
               message.error('Failed to refresh token');
            }
         } else {
            console.error('Error approving recruiter:', error);
            message.error('Failed to approve recruiter');
         }
      }
   };

   const handleReject = async (recruiterId, status, userid) => {
      console.log(recruiterId, status, userid);
      try {
         const res = await axios.post('http://localhost:8001/api/admin/getreject', 
            { recruiterId, status, userid }, 
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            });

         if (res.data.success) {
            message.success(res.data.message);
            fecthingAllRecruiters();
         } else {
            message.error('Failed to reject recruiter');
         }
         console.log(res);
      } catch (error) {
         console.log(error);
         message.error('something went wrong');
      }
   };

   return (
      <div>
         <MDBTable striped>
            <MDBTableHead>
               <tr>
                  <th scope='col'>User ID</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Action</th>
               </tr>
            </MDBTableHead>
            <MDBTableBody>
               {recruitUser.map((user, index) => (
                  <tr key={index}>
                     <th scope='row'>{user._id}</th>
                     <td>{user.name}</td>
                     <td>{user.email}</td>
                     <td>{user.status}</td>
                     <td>
                        {user.status === 'pending' ? (
                           <Button onClick={() => handleApprove(user._id, 'approved', user.userId)} className='mx-2' size='sm' variant="outline-success">
                              Approve
                           </Button>
                        ) : (
                           <Button onClick={() => handleReject(user._id, 'rejected', user.userId)} className='mx-2' size='sm' variant="outline-danger">
                              Reject
                           </Button>
                        )}
                     </td>
                  </tr>
               ))}
            </MDBTableBody>
         </MDBTable>
         <p>There are {recruitUser.length} recruiters in the App.</p>
      </div>
   );
};

export default RecruiterStatus;
