import mongoose from "mongoose";
import { sendErrorResponse } from "../utils/response.js";

export const connectMongoDB = async(req,res)=>{
    try{
       console.log(`Connecting to Mongo Instance`);
       console.log("Mongo url-->",process.env.MONGO_URL)
       await mongoose.connect(process.env.MONGO_URL);
       console.log(`Successfully Connected to MongoDB`);
    }catch(err){
        console.error(`Error While Connecting to MongoDB -- ${err.message}`);
        throw Error("Error Connecting to DataBase");
    }
}