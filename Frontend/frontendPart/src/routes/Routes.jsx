import React from 'react'
import {BrowserRouter as AppRouter, Route, Routes as AppRoutes} from 'react-router-dom'
import Home from '../views/Home/Home'
import CreateProject from '../views/create-project/CreateProject'
import Project from '../views/project-show/Project'


const Routes = () => {
  return (
    <div>
      <AppRouter>
        <AppRoutes>
          <Route path='/' element={<Home/>} />
          <Route path='/create-project' element={<CreateProject />} />
          <Route path='/project/:id' element={<Project />}></Route>
        </AppRoutes>
      </AppRouter>
    </div>
  )
}

export default Routes
