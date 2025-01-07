import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import jsend from "jsend";
import cors from "cors";
import appRouter from "./routes/index.routes.js";


const app = express();

dotenv.config();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  }));
app.use(jsend.middleware);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));


app.use("/api/v1", appRouter);


export default app;