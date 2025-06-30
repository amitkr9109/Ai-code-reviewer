import mongoose from "mongoose";

const OnlineSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Online", OnlineSchema);