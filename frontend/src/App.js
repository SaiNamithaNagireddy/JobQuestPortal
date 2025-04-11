import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/common/Login";
import Home from "./components/common/Home";
import SignUp from "./components/common/SignUp";
import ContactUs from "./components/common/ContactUs";
import SeekerHome from "./components/user/jobseeker/SeekerHome";
import RecruiterHome from "./components/user/recruiter/RecruiterHome";
import AdminHome from "./components/admin/AdminHome";

function App() {
  const userLoggedIn = !!localStorage.getItem("userData");

  return (
    <div className="App">
      <Router>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contactus" element={<ContactUs />} />
            {userLoggedIn ? (
              <>
                <Route path="/adminhome" element={<AdminHome />} />
                <Route path="/seekerhome" element={<SeekerHome />} />
                <Route path="/recruiterhome" element={<RecruiterHome />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer className="bg-light text-center text-lg-start">
          <div className="text-center p-3">© 2024 Copyright: Job-Quest</div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
