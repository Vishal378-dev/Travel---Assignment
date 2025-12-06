import http from "http";
import app from "./app.js";
import 'dotenv/config';
import { graceFullyShutDown } from "./src/utils/common.js";
import { connectMongoDB } from "./src/db/mongo.db.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

connectMongoDB();

server.listen(PORT,()=>{
    console.log(`###############################################
Server is listening on ${PORT}
###############################################`);
});


process.on("SIGTERM",()=>graceFullyShutDown("SIGTERM",server));
process.on("SIGINT",()=>graceFullyShutDown("SIGINT",server));