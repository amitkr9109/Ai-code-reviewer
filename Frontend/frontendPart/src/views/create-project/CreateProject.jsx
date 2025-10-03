import React, { useState } from 'react'
import "./CreateProject.css"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'



const CreateProject = () => {

  const [projectname, setprojectName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function SubmitHandler(e){
    e.preventDefault();

    if(!projectname.trim()) {
      toast.error("Project name is required!");
      return;
    }

    setLoading(true)

    axios.post(`${import.meta.env.VITE_BASE_URL}/projects/create`,{
      projectname
    }).then(function(){
      toast.success("project created successfully!");
      navigate("/");
    }).catch(function() {
      toast.error("Something went wrong. Please try again.");
    }).finally(function() {
      setLoading(false);
    })
  }

  return (
    <div>
        <main className='create-project'>
          <a href="/" className='a-tag'>Go Back to Home Page...</a>
            <section className='create-project-section'>
                <form onSubmit={SubmitHandler}>
                    <input onChange={function(e){
                      setprojectName(e.target.value)
                    }} value={projectname} type="text" placeholder='Enter Project Name'/>
                    <button type="submit" disabled={loading}>
                      {loading ? <ClipLoader size={20} color='white' /> : "Submit"}
                    </button>
                </form>
            </section>
        </main>
    </div>
  )
}

export default CreateProject
