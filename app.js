import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import router from "./src/routes/index.js";
import { logger } from "./src/utils/logger.js";
import { v4 as uuid } from "uuid";
import { sendErrorResponse, sendSuccessResponse } from "./src/utils/response.js";
import { connectMongoDB } from "./src/db/mongo.db.js";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(helmet());
app.use(cors());
app.use(rateLimit({
    windowMs: 1*60*1000,
    max: 10,
    legacyHeaders:true,
    standardHeaders:true,
    skip: (req) => req.method === "OPTIONS",
    keyGenerator:(req,res)=>{
        return ipKeyGenerator(req.ip)
    },
    message:{
        message:"Too Many Requests.Please Try After Some time"
    }
}));

app.use((req, res, next) => {
  req.logger = logger.child({
    Origin: req.headers["Origin"] || req.headers["origin"],
    ip: req.ip,
    requestId:uuid(),
    method:req.method,
    url:req.originalUrl,
    protocol: req.protocol,
    environment: process.env.NODE_ENV || "dev"
  });
  next();
});

app.get("/",(req,res) => {
    sendSuccessResponse(res,200,"server is up");
});

app.get("/health",(req,res) =>{
    sendSuccessResponse(res,200,"ok",{})
});

app.use("/api",router);



export default app;