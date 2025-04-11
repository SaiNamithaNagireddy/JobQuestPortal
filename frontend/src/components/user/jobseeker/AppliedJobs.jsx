import { message } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const AppliedJobs = () => {
   const [userdata, setUserData] = useState(null);
   const [allApplication, setAllApplication] = useState([]);

   const getUser = () => {
      const user = JSON.parse(localStorage.getItem('userData'));
      if (user) {
         setUserData(user);
      }
   };

   useEffect(() => {
      getUser();
   }, []);

   useEffect(() => {
      const getAllApplication = async () => {
         if (userdata?._id !== undefined) {
            try {
               const res = await axios.get(`http://localhost:8001/api/user/getallapplications/${userdata._id}`, {
                  headers: {
                     Authorization: "Bearer " + localStorage.getItem('token')
                  },
               });
               if (res.data.success) {
                  setAllApplication(res.data.data);
               }
            } catch (error) {
               console.log(error);
               message.error('Something went wrong');
            }
         }
      };

      getAllApplication();
   }, [userdata]);

   return (
      <div>
         <MDBTable striped>
            <MDBTableHead>
               <tr>
                  <th scope='col'>Application ID</th>
                  <th scope='col'>Job Title</th>
                  <th scope='col'>Job Status</th>
                  <th scope='col'>Applied On</th>
               </tr>
            </MDBTableHead>
            <MDBTableBody>
               {allApplication && allApplication.map((application) => {
                  return (
                     <tr key={application._id}>
                        <th scope='row'>{application._id}</th>
                        <td>{application.jobInfo?.jobTitle || 'N/A'}</td>
                        <td>{application.status}</td>
                        <td>{application.createdAt || 'N/A'}</td>
                     </tr>
                  );
               })}
            </MDBTableBody>
         </MDBTable>
         <p>You have applied for {allApplication.length} jobs in the App.</p>
      </div>
   );
};

export default AppliedJobs;
