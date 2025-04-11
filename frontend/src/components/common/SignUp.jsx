import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { message } from 'antd';

const SignUp = () => {
   const navigate = useNavigate();
   const [selectedOption, setSelectedOption] = useState('Select User');
   const [user, setUser] = useState({
      firstname: '', lastname: '', email: '', password: '', type: ""
   });

   const handleSelect = (eventKey) => {
      setSelectedOption(eventKey);
      setUser({ ...user, type: eventKey });
   };

   const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await axios.post("http://localhost:8001/api/user/register", user, {
            headers: {
               'Content-Type': 'application/json'
            }
         });
         if (res.data.success) {
            //localStorage.setItem('token', res.data.token);
            //localStorage.setItem('userData', JSON.stringify(res.data.userData));
            message.success(res.data.message);
            navigate('/login')
           // const isLoggedIn = JSON.parse(localStorage.getItem("userData"));
         //    const { type, isRecruiter } = isLoggedIn;
         //    switch (type) {
         //       case "Admin":
         //          navigate("/adminHome");
         //          break;
         //       default:
         //          if (isRecruiter === true) {
         //             navigate('/recruiterhome');
         //          } else {
         //             navigate('/seekerhome');
         //          }
         //          break;
         //    }
          } else {
             message.error(res.data.message);
          }
      } catch (error) {
         console.log('Error:', error.response ? error.response.data : error.message);
         message.error('Something went wrong');
      }
   };

   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
               <Navbar.Brand>
                  <Link to={'/'}>Job-Quest</Link>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                  </Nav>
                  <Nav>
                     <Link to={'/'}>Home</Link>
                     <Link to={'/login'}>Login</Link>
                     <Link to={'/signup'}>Register</Link>
                     <Link to={'/contactus'}>Contact Us</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         <Container className='my-4'>
            <section style={{ width: '70vw', paddingLeft: '20%' }} className="text-center">
               <div className="p-5 bg-image"
                  style={{
                     backgroundImage: "url('https://mdbootstrap.com/img/new/textures/full/171.jpg')",
                     height: "300px",
                  }}
               ></div>

               <div className="card mx-4 mx-md-5 shadow-5-strong"
                  style={{
                     marginTop: "-175px",
                     background: "hsla(0, 0%, 100%, 0.8)",
                     backdropFilter: "blur(30px)",
                  }}
               >
                  <div className="card-body py-5 px-md-5">
                     <div className="row d-flex justify-content-center">
                        <div className="col-lg-8">
                           <h2 className="fw-bold mb-5">Sign Up Here</h2>
                           <form onSubmit={handleSubmit}>
                              <div className="row">
                                 <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                       <label className="form-label" htmlFor="form3Example1">
                                          First name
                                       </label>
                                       <input
                                          type="text"
                                          id="form3Example1"
                                          className="form-control"
                                          name='firstname'
                                          onChange={handleChange}
                                          value={user.firstname}
                                       />
                                    </div>
                                 </div>
                                 <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                       <label className="form-label" htmlFor="form3Example2">
                                          Last name
                                       </label>
                                       <input
                                          type="text"
                                          id="form3Example2"
                                          className="form-control"
                                          name='lastname'
                                          onChange={handleChange}
                                          value={user.lastname}
                                       />
                                    </div>
                                 </div>
                              </div>

                              <div className="form-outline mb-4">
                                 <label className="form-label" htmlFor="form3Example3">
                                    Email address
                                 </label>
                                 <input
                                    type="email"
                                    id="form3Example3"
                                    className="form-control"
                                    name='email'
                                    onChange={handleChange}
                                    value={user.email}
                                 />
                              </div>

                              <div className="form-outline mb-4">
                                 <label className="form-label" htmlFor="form3Example4">
                                    Password
                                 </label>
                                 <input
                                    type="password"
                                    id="form3Example4"
                                    className="form-control"
                                    name='password'
                                    onChange={handleChange}
                                    value={user.password}
                                 />
                              </div>
                              <Dropdown className='my-3'>
                                 <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {selectedOption}
                                 </Dropdown.Toggle>

                                 <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleSelect("Seeker")}>Seeker</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSelect("Recruiter")}>Recruiter</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSelect("Admin")}>Admin</Dropdown.Item>
                                 </Dropdown.Menu>
                              </Dropdown>

                              <Button
                                 type="submit"
                                 className="btn bg-dark btn-primary btn-block mb-4 border-0"
                              >
                                 Sign up
                              </Button>
                           </form>
                           <p>Have a Account?<Link to={'/login'}> <b>Sign In</b> Here</Link></p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </Container>
      </>
   );
}

export default SignUp;
