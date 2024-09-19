import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'; 
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

dotenv.config();



// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(cors({
  origin: 'http://webappbucket65.s3-website-us-east-1.amazonaws.com',  // Update this to your S3 bucket URL
  credentials: true,  // If you are sending cookies or authentication tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers (for JSON, Authorization tokens, etc.)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PayPal and Google API keys
app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.get("/api/keys/google", (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});

// API Routes
app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Define the port and start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend is running at ${port}`);
});
