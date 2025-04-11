import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Button } from 'react-bootstrap';

import AllJobsSeeker from '../user/jobseeker/AllJobsSeeker';

const Home = () => {
   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
               <Navbar.Brand>
                  <Link to={'/'} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#343a40' }}>Job-Quest</Link>
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
                     <Link to={'/'} className="nav-link btn btn-outline-warning" style={{ color: '#343a40' }}>Home</Link>
                     <Link to={'/login'} className="nav-link btn btn-outline-warning" style={{ color: '#343a40' }}>Login</Link>
                     <Link to={'/signup'} className="nav-link btn btn-outline-warning" style={{ color: '#343a40' }}>Register</Link>
                     <Link to={'/contactus'} className="nav-link btn btn-outline-warning" style={{ color: '#343a40' }}>Contact Us</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         <div id='home-container' className='first-container front'>
            <div className="content-home" style={{ marginTop: '-2cm' }}>
               <p>Empowering Careers, Enriching Lives: <br />Your Journey to Success Starts Here!</p>
               <Button className='m-2' variant='outline-warning' size='lg'><Link to={'/signup'}>Sign Up Now</Link></Button>
            </div>
         </div>

         <Container className="second-container">
            <h2 className="text-center my-4">Our Jobs to Apply</h2>
            <AllJobsSeeker />
         </Container>
      </>
   );
};

export default Home;
