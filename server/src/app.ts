import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import announcementRoutes from "./routes/announcements";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

connectDB();

// Health Check Route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Community CMS API is running 🚀",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
