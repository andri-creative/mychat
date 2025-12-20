import { createServer } from "http";
import dotenv from "dotenv";
import os from "os";

import app from "./app";
import connectDB from "./lib/mongodb";

dotenv.config();

const PORT = Number(process.env.PORT) || 3050;
const HOST = "0.0.0.0";

function printLocalIPs(port: number) {
  const nets = os.networkInterfaces();

  console.log("🔗 Available URLs:");

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`   http://${net.address}:${port}`);
      }
    }
  }
}

async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const server = createServer(app);

    server.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Local: http://localhost:${PORT}`);

      // 🔥 AUTO tampilkan IP LAN
      printLocalIPs(Number(PORT));
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
