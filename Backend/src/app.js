import express from "express";
import projectRoutes from "./routes/projectroutes.js"
import cors from "cors"
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get("/", function(req, res){
    res.send("hello world !");
});

app.use("/projects", projectRoutes);

export default app;
