// const express=require("express");
// const mongoose=require("mongoose");
const dotenv=require("dotenv");
const app=require("./app");
const connectDatabase=require("./config/dataBase");

//handling uncaught exception error
process.on("uncaughtException",(erro)=>{
    console.log(`Error : ${erro.message}`);
    console.log("Shutting down the server due to Uncaught Exception error");
    server.close((err)=>{
        process.exit(1);
    });
});
// console.log(hello)
//config
dotenv.config({path:"Backend/config/config.env"})
//connecting to database
connectDatabase();

//for handling unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to Unhandled Rejection error");
    server.close((err)=>{
        process.exit(1);
    });
});


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is started at the port http://localhost:${process.env.PORT 
|| 8000}`);
})
// const PORT=process.env.PORT || 5000;
