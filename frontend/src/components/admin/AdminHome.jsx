import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import { Container, Button, Tabs, Tab } from 'react-bootstrap';
import { Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';

import AllUser from './AllUser';
import Notification from '../common/Notification';
import RecruiterStatus from './RecruiterStatus';
import AllJobs from './AllJobs';
import FeedBack from './FeedBack';

const AdminHome = () => {
   const [userdata, setUserData] = useState([]);
   const [basicActive, setBasicActive] = useState('allusers');

   const handleSelect = (key) => {
      setBasicActive(key);
   };

   const getUser = () => {
      const user = JSON.parse(localStorage.getItem('userData'));
      if (user) {
         setUserData(user);
      }
   };

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

   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/";
   };

   return (
      <>
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
                     <Badge className='notify' onClick={() => handleSelect('notification')} count={userdata?.notification ? userdata.notification.length : 0}>
                        <BellOutlined className='icon' />
                     </Badge>
                     <Button onClick={handleLogout} size='sm' variant='outline-danger' >Log Out</Button >
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <Container>
            <Tabs
               id="admin-tabs"
               activeKey={basicActive}
               onSelect={handleSelect}
               className='my-4 mb-3'
            >
               <Tab eventKey="allusers" title="All Users">
                  <AllUser />
               </Tab>
               <Tab eventKey="recruiterstatus" title="All Recruiter">
                  <RecruiterStatus />
               </Tab>
               <Tab eventKey="notification" title="Notification">
                  <Notification />
               </Tab>
               <Tab eventKey="alljobs" title="All Jobs">
                  <AllJobs />
               </Tab>
               <Tab eventKey="allfeedback" title="All Feedback">
                  <FeedBack />
               </Tab>
            </Tabs>
         </Container>
      </>
   );
};

export default AdminHome;
