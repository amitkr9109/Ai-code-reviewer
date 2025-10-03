import React, { useState,useEffect } from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { io as SocketIo } from "socket.io-client";
import { toast } from 'react-toastify';

const Home = () => {

  const navigate = useNavigate();

  const [projects, setProject] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(function(){
    axios.get(`${import.meta.env.VITE_BASE_URL}/projects/getAll`)
    .then(function(response){
      setProject(response.data.data)
    })
  })


  useEffect(() => {
    const socket = SocketIo(`${import.meta.env.VITE_BASE_URL}`);
    socket.on("online-users-update", function(data){
    setOnlineUsers(data)
    })
    return () => socket.disconnect();
  }, []);

  const DeleteHandler = function(id){
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if(!confirm) return;
    axios.delete(`${import.meta.env.VITE_BASE_URL}/projects/delete/${id}`)
    try {
      setProject(prev => prev.filter(project => project._id !== id));
      toast.success("project deleted successfully!")
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }

  function openProject(id){
    navigate(`/project/${id}`)
  }

  return (
    <main className='home'>
      <section className='home-section'>
        <button onClick={function(){
          navigate('/create-project')
        }}>Create Project</button>
      </section>
      {projects?.length == 0 ? <div><p>No Projects Create ...</p></div> : <section className='show-project-section'>
        <h3>All Create Projects Here ...</h3>
          <div className="projects">
            {projects?.map(function(project){
              return <div className="project-str">
                <div className="project-name">{project.name}</div>
                <div className="icons">
                  <div className='view-icon' onClick={function(){
                    openProject(project._id)
                  }}><i class="ri-eye-fill"></i></div>
                  <div className="online-part">
                    <h5>Online - {onlineUsers[project._id] || 0}</h5>
                  </div>
                  <div onClick={function(){
                    DeleteHandler(project?._id)
                    }} className="delete-icon">
                    <i class="ri-delete-bin-fill"></i>
                  </div>
                </div>
              </div>
            })}
          </div>
      </section>}
    </main>
  )
}

export default Home