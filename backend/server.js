import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port =process.env.PORT || 4000;

//middlewares
app.use(express.json());

// CORS configuration - allow production URLs and localhost for development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean); // Remove undefined/null values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
// Serve uploaded images statically
// NOTE: Render's local filesystem is ephemeral. For production, consider using cloud storage (AWS S3, Cloudinary)
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
