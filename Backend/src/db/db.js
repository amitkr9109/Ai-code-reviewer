import mongoose from "mongoose";
import config from "../config/config.js"

function connectToDB(){
    mongoose.connect(process.env.MONGODB_URI)
        .then(function(){
            console.log("Connected to MongoDB");
        })
        .catch(function(err){
            console.log("Error connecting to MongoDB", err);
        })
}

export default connectToDB;