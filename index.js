import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
// import cors from "cors";

const app = express();
dotenv.config();

const port = process.env.PORT;
const cors = require("cors");
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'self' https://code.jquery.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://cdn.jsdelivr.net 'sha256-ISInfOBSUWFgeTRFLf63g+rFNSswGDl15oK0iXgYM='; style-src 'self' https://stackpath.bootstrapcdn.com https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self'; frame-src 'self'"
  );
  
  next();
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});


app.listen(port, () => {
  connect();
  console.log("Connected to backend.");
});
