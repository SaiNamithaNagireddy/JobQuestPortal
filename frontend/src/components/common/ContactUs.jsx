import { message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { Link, useNavigate } from 'react-router-dom';

const ContactUs = () => {
   const navigate = useNavigate()
   const [user, setUser] = useState({
      firstname: '',
      lastname: '',
      email: '',
      message: ''
   })

   const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value })
   }
   const handleSubmit = async (e) => {
      e.preventDefault()
      try {
         const res = await axios.post("http://localhost:8001/api/user/feedback", user)
         console.log(res)
         if (res.data.success) {
            message.success("Your message has been sent!")
            navigate('/')
         }
         else {
            message.error(res.data.message)
         }

      } catch (error) {
         console.log(error)
         message.error('Something went wrong')
      }
   }
   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary bg-dark">
            <Container fluid>
               <Navbar.Brand>
                  <Link to={'/'}>Job-Quest</Link>
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
                     <Link to={'/'}>Home</Link>
                     <Link to={'/login'}>Login</Link>
                     <Link to={'/signup'}>Register</Link>
                     <Link to={'/contactus'}>Contact Us</Link>
                  </Nav>

               </Navbar.Collapse>
            </Container>
         </Navbar>
         <Container>
            <section className="text-center">
               <div
                  className="p-5 bg-image"
                  style={{
                     backgroundImage:
                        "url('https://mdbootstrap.com/img/new/textures/full/171.jpg')",
                     height: "300px",
                  }}
               ></div>

               <div
                  className="card mx-4 mx-md-5 shadow-5-strong"
                  style={{
                     marginTop: "-100px",
                     background: "hsla(0, 0%, 100%, 0.8)",
                     backdropFilter: "blur(30px)",
                  }}
               >
                  <div className="card-body py-5 px-md-5">
                     <div className="row d-flex justify-content-center">
                        <div className="col-lg-8">
                           <h2 className="fw-bold mb-5">Contact Us</h2>
                           <form onSubmit={handleSubmit}>
                              <div className="form-outline mb-4">
                                 <div className="form-outline">
                                    <label className="form-label" htmlFor="form3Example1">
                                       First name
                                    </label>
                                    <input
                                       type="text"
                                       id="form3Example1"
                                       className="form-control" name="firstname" onChange={handleChange} value={user.firstname}
                                    />
                                 </div>
                                 <div className="form-outline">
                                    <label className="form-label" htmlFor="form3Example1">
                                       Last name
                                    </label>
                                    <input
                                       type="text"
                                       id="form3Example1"
                                       className="form-control" name="lastname" onChange={handleChange} value={user.lastname}
                                    />
                                 </div>
                                 <label className="form-label" htmlFor="form3Example3">
                                    Email address
                                 </label>
                                 <input
                                    type="email"
                                    id="form3Example3"
                                    className="form-control" name="email" onChange={handleChange} value={user.email}
                                 />
                              </div>

                              <div className="form-outline">
                                 <label className="form-label" htmlFor="textAreaExample">Message</label>
                                 <textarea name="message" onChange={handleChange} value={user.message} className="form-control" id="textAreaExample" rows="4"></textarea>
                              </div>

                              <button
                                 type="submit"
                                 className="btn bg-dark btn-primary btn-block mb-4 form-control border-0"

                              >
                                 Submit
                              </button>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </Container>
      </>
   )
}

export default ContactUs
