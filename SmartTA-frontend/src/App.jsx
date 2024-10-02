import { useState } from 'react'
import Login from './components/Login'
import Signup from './components/SignUp'
import ForgotPassOne from './components/FogotPassOne'
import OtpVerification from './components/OtpVerification'
import SetNewPassword from './components/SetNewPassword'
import PageNotFound from './components/PageNotFound'
import TeacherHome from './components/TeacherHome'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Login /> */}
      {/* <Signup /> */}
      {/* <ForgotPassOne /> */}
      {/* <OtpVerification /> */}
      {/* <SetNewPassword /> */}
      {/* <PageNotFound /> */}
      <TeacherHome />
    </>
  )
}

export default App
