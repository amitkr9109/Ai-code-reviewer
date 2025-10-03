import React from 'react'
import Routes from './Routes/routes'
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.css"

const App = () => {
  return (
    <div>
      <Routes />
      <ToastContainer />
    </div>
  )
}

export default App
