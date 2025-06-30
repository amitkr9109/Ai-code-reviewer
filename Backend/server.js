import app from "./src/app.js";
import connectToDB from "./src/db/db.js";
import MessageModel from "./src/models/message.model.js";
import ProjectModel from "./src/models/project.model.js";
import { getReview } from "./src/services/ai.service.js";
connectToDB();


import { Server as SocketServer } from "socket.io";
import http from 'http';

const server = http.createServer(app);

const io = new SocketServer(server, {
    cors: {
        origin: '*',
    }
});

const projectOnlineUsers = {};

function getUserCounts() {
    const counts = {};
    for (let projectId in projectOnlineUsers) {
        counts[projectId] = projectOnlineUsers[projectId].size;
    }
    return counts;
}


io.on("connection", function(socket){
    console.log("client connected successfully");

    const SocketRoomJoining = socket.handshake.query.projecidshow
    socket.join(SocketRoomJoining)

    if (!projectOnlineUsers[SocketRoomJoining]) {
        projectOnlineUsers[SocketRoomJoining] = new Set();
    }
    projectOnlineUsers[SocketRoomJoining].add(socket.id);


    io.emit("online-users-update", getUserCounts())

    socket.on("disconnect", function(){
        console.log("client disconnected");

        if(projectOnlineUsers[SocketRoomJoining]){
            projectOnlineUsers[SocketRoomJoining].delete(socket.id)

            if(projectOnlineUsers[SocketRoomJoining].size === 0){
                delete projectOnlineUsers[SocketRoomJoining]
            }
        }
        io.emit("online-users-update", getUserCounts())
    });

    socket.on("chat-message", async function(message){
        socket.broadcast.to(SocketRoomJoining).emit("Chat-Messages", message)

        await MessageModel.create({
            project: SocketRoomJoining,
            text: message
        })
    })

    socket.on("chat-history", async function(){
        const MessageHistory = await MessageModel.find({project: SocketRoomJoining})
        socket.emit("chat-history", MessageHistory)
    })

    socket.on("code-update", async function(codesave){
        socket.broadcast.to(SocketRoomJoining).emit("code-update", codesave)
        await ProjectModel.findOneAndUpdate({_id: SocketRoomJoining}, {code: codesave})
    })

    socket.on("code-history", async function(){
        const codeHistorySave = await ProjectModel.findById(SocketRoomJoining).select("code")
        socket.emit("code-show", codeHistorySave.code)
    })

    socket.on("get-review", async function(code){
        const reviewsave = await getReview(code)
        socket.emit("code-review", reviewsave)
        await ProjectModel.findOneAndUpdate({_id: SocketRoomJoining},{review: reviewsave})
    })

    socket.on("review-history", async function(){
        const reviewHistory = await ProjectModel.findById(SocketRoomJoining).select("review")
        socket.emit("review-show", reviewHistory.review)
    })


});

server.listen(3000, function(){
    console.log("the server is running on port 3000");
});