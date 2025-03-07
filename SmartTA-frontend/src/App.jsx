import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/SignUp';
import ForgotPassOne from './components/FogotPassOne';
import OtpVerification from './components/OtpVerification';
import SetNewPassword from './components/SetNewPassword';
import PageNotFound from './components/PageNotFound';
import TeacherHome from './components/TeacherHome';
import StudentHome from './components/StudentHome';
import TeacherGradesPage from './components/TeacherGradesPage';
import SubmitQuestionPaper from './components/submitQuestionPaper';
import TeacherFirst from './components/TeacherFirst';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassOne />} />
        <Route path="/teacher-first" element={<TeacherFirst />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/teacher-home" element={<TeacherHome />} />
        <Route path="/submit-question" element={<SubmitQuestionPaper />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/teacher-grades" element={<TeacherGradesPage />} />
        <Route path="*" element={<PageNotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;
