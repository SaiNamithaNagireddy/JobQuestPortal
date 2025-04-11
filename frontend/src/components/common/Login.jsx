import { message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8001/api/user/login", user);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userData', JSON.stringify(res.data.userData));
        
        message.success('Login successful');
        
        const { type, isRecruiter } = res.data.userData;

        if (type === "Admin") {
          navigate("/adminHome");
        } else if (isRecruiter) {
          navigate("/recruiterhome");
        } else {
          navigate("/seekerhome");
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
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
            <Nav className="me-auto my-2 my-lg-0" navbarScroll></Nav>
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
          <div className="p-5 bg-image" style={{ backgroundImage: "url('https://mdbootstrap.com/img/new/textures/full/171.jpg')", height: "300px" }}></div>
          <div className="card mx-4 mx-md-5 shadow-5-strong" style={{ marginTop: "-170px", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(30px)" }}>
            <div className="card-body py-5 px-md-5">
              <div className="row d-flex justify-content-center">
                <div className="col-lg-8">
                  <h2 className="fw-bold mb-5">Login Now</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example3">Email address</label>
                      <input
                        type="email"
                        id="form3Example3"
                        className="form-control"
                        name='email'
                        value={user.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example4">Password</label>
                      <input
                        type="password"
                        id="form3Example4"
                        className="form-control"
                        name='password'
                        value={user.password}
                        onChange={handleChange}
                        autoComplete='off'
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="btn bg-dark btn-primary btn-block mb-4 border-0"
                      size='mb'
                    >
                      Login 
                    </Button>
                  </form>
                  <p>Want to have a Account? <Link to={'/signup'}><b> Sign Up</b> Here</Link></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}

export default Login;
