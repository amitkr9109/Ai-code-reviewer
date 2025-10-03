import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Project.css'
import { io as SocketIo } from "socket.io-client"
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const Project = () => {

    const params = useParams();

    const [Messages, setMessages] = useState([]);
    const [input, setInput] = useState();
    const [socket, setSocket] = useState();
    const [code, setCode] = useState("// Write Your Code Here...\n");
    const [language, setLanguage] = useState("javascript");
    const [review, setReview] = useState("*No review yet. Click 'get-review' to generate a code review.*") ;
    const [loading, setLoading] = useState(false);

    function HandleMessage(){

        if(!input || !input.trim()) {
            toast.error("Message is required!");
            return;
        }

        setMessages(function(prev){
            return [ ...prev, input ]
        })
        socket.emit("chat-message", input)
        setInput("");
    }

    function changeLanguage(newlanguage){
        setLanguage(newlanguage)
    }

    function HandleEditorChange(value){
        setCode(value)
        socket.emit("code-update", value)
    }

    function getReview(){
        setLoading(true);
        socket.emit("get-review", code)
    }

    useEffect(function(){
        const io = SocketIo(`${import.meta.env.VITE_BASE_URL}`, {
            query: {
                projecidshow : params.id 
            }
        })

        io.emit("chat-history")

        io.on("chat-history", function(messages){
            setMessages(messages.map((message) => message.text))
        })

        io.on("Chat-Messages", function(message){
            setMessages(function(prev){
                return[ ...prev, message ]
            })
        })

        io.emit("code-history")

        io.on("code-update", function(code){
            setCode(code)
        })

        io.on("code-show", function(code){
            setCode(code)
        })


        io.on("code-review", function(review){
            setReview(review)
            setLoading(false)
        })

        io.emit("review-history")

        io.on("review-history", function(review){
            setReview(review)
            setLoading(false)
        })

        io.on("review-show", function(review){
            setReview(review)
            setLoading(false)
        })

        setSocket(io)
    },[])


  return (
      <main className='project-main'>
        <section className='project-section'>
            <div className="chat">
                <div className="messages">
                    <a href="/" className='a-tag'>Go Back to Home Page...</a>
                    {Messages?.map (function(Message){
                        return <div className="message">{Message}</div>
                    })}
                </div>
                <div className="input-area">
                    <input type="text" placeholder='Enter message...' value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
                        if(e.key === "Enter") {
                            HandleMessage()
                        }
                    }} />
                    <button onClick={function(){
                        HandleMessage()
                    }}><i class="ri-send-plane-2-fill"></i></button>
                </div>
            </div>
            <div className="code">
                <div className="language-selector">
                    <select value={language} onChange={function(e){
                        changeLanguage(e.target.value)
                    }}>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                    </select>
                </div>
                <Editor
                    height="90%"
                    width="100%"
                    language={language}
                    value={code}
                    onChange={HandleEditorChange}
                    theme="vs-dark"
                    options={{
                        minimap: {enabled: true},
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                        formatOnType: true,
                        formatOnPaste: true,
                        cursorBlinking: 'smooth',
                    }}
                />
            </div>
            <div className="review">
                <div className="review-content">
                    <ReactMarkdown>{review}</ReactMarkdown>
                </div>
                <button onClick={function(){
                    getReview()
                }} className='get-review' disabled={loading}>{loading ? <ClipLoader size={20} color='blue' /> : "Review"}</button>
            </div>
        </section>
      </main>
  )
}

export default Project
