import { createServer } from "http";
import dotenv from "dotenv";

import app from "./app";
// import SocketServer from "./lib/socket";
import connectDB from "./lib/mongodb";

dotenv.config();

const PORT = process.env.PORT || 3050;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB connected");

    // Create HTTP server
    const server = createServer(app);

    // Initialize Socket.io
    // new SocketServer(server);
    // console.log("✅ Socket.io initialized");

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
