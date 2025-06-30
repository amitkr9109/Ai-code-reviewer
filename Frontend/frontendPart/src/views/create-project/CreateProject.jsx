import React, { useState } from 'react'
import "./CreateProject.css"
import axios from "axios"
import { useNavigate } from 'react-router-dom'



const CreateProject = () => {

  const [projectname, setprojectName] = useState("");
  const navigate = useNavigate();

  function SubmitHandler(e){
    e.preventDefault();

    axios.post("http://localhost:3000/projects/create",{
      projectname
    }).then(function(){
      navigate("/");
    })
  }

  return (
    <div>
        <main className='create-project'>
          <a href="/" className='a-tag'>Go Back to Home Page...</a>
            <section className='create-project-section'>
                <form onSubmit={SubmitHandler}>
                    <input required onChange={function(e){
                      setprojectName(e.target.value)
                    }} value={projectname} type="text" placeholder='Enter Project Name'/>
                    <input type="submit" />
                </form>
            </section>
        </main>
    </div>
  )
}

export default CreateProject
