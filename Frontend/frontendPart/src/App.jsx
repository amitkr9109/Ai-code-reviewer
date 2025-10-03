import React from 'react'
import Routes from './routes/Routes'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <div>
      <Routes />
      <ToastContainer />
    </div>
  )
}

export default App
