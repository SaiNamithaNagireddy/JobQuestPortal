import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import { Badge, message } from 'antd';
import { BellOutlined } from '@ant-design/icons'
import {
   MDBTabs,
   MDBTabsItem,
   MDBTabsLink,
   MDBTabsContent,
   MDBTabsPane
} from 'mdb-react-ui-kit';
import Notification from '../../common/Notification';
import AllJobsSeeker from './AllJobsSeeker';
import AppliedJobs from './AppliedJobs';


const RecruiterHome = () => {
   const [userdata, setUserData] = useState({})
   const [basicActive, setBasicActive] = useState('appliedjobs');

   const handleBasicClick = (val) => {
      if (val === basicActive) {
         return;
      }
      setBasicActive(val);
   };

   const getUser = () => {
      const user = JSON.parse(localStorage.getItem('userData'))
      if (user) {
         setUserData(user)
      }
   }

   const getUserData = async () => {
      try {
         await axios.post('http://localhost:8001/api/user/getuserdata', {}, {
            headers: {
               Authorization: "Bearer " + localStorage.getItem('token')
            },
         });
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getUser();
      getUserData();
   }, []);

   const handleApply = async () => {
      try {
         const res = await axios.post('http://localhost:8001/api/user/register_recruiter', { userId: userdata._id }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
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
   }

   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/";
   }

   return (
      < >
         <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
               <Navbar.Brand>
                  <h3>Job-Quest</h3>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav
                     className="me-auto my-2 my-lg-0"
                     style={{ maxHeight: '100px' }}
                     navbarScroll
                  >
                  </Nav>
                  <Nav>
                     <h5 className='mx-3'>Hi {userdata.firstname + " " + userdata.lastname}</h5>
                     <Badge className='notify' onClick={() => handleBasicClick('notification')} count={userdata?.notification ? userdata.notification.length : 0}>
                        <BellOutlined className='icon' />
                     </Badge>
                     {userdata.isRecruiter === true ? <></> : <Button className='mx-3' onClick={handleApply} size='sm' variant='outline-success' >Apply as Recruiter</Button >}
                     <Button onClick={handleLogout} size='sm' variant='outline-danger' >Log Out</Button >
                  </Nav>

               </Navbar.Collapse>
            </Container>
         </Navbar>

         <Container>
            <MDBTabs className='my-4 mb-3'>
               <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('appliedjobs')} active={basicActive === 'appliedjobs'}>
                     Applied Jobs
                  </MDBTabsLink>
               </MDBTabsItem>
               <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('notification')} active={basicActive === 'notification'}>
                     Notification
                  </MDBTabsLink>
               </MDBTabsItem>
               <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleBasicClick('alljobsseeker')} active={basicActive === 'alljobsseeker'}>
                     All Jobs
                  </MDBTabsLink>
               </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
               <MDBTabsPane show={basicActive === 'appliedjobs'}><AppliedJobs /></MDBTabsPane>
               <MDBTabsPane show={basicActive === 'alljobsseeker'}><AllJobsSeeker /></MDBTabsPane> 
               <MDBTabsPane show={basicActive === 'notification'}><Notification /></MDBTabsPane>
            </MDBTabsContent>
         </Container>
      </>
   )
}

export default RecruiterHome
