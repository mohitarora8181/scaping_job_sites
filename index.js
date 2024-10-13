import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";

import linkedin from "./routes/linkedin.js";
import inShala from "./routes/internshala.js";
import instahyre from "./routes/instahyre.js";

config();

const port = process.env.PORT || 4000

const app = express();
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    return res.send("running...");
});

app.use("/linkedin",linkedin);
app.use("/internshala",inShala);
app.use("/instahyre",instahyre);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});