const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

require("dotenv").config();

const app=express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri=process.env.ATLAS_URI;
mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
});
const connection=mongoose.connection;
connection.once("open",()=>{
    console.log("Mongoose Databse Connection Established Successfully");
});

const todoRouter=require("./routes/todos");

app.use("/todos",todoRouter);

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});