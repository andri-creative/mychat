import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./lib/mongodb";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
connectDB();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.errorHandling();
  }

  // ⬇️ TANPA private
  config(): void {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));

    this.app.use(passport.initialize());
  }

  // ⬇️ TANPA private
  routes(): void {

    this.app.get('/', (req, res) => {
      res.status(200).json({
        status: true,
        message: "Backend v1 ready 🚀",
        services: {
          database: "MongoDB",
          realtime: "Socket.IO",
          auth: ["Google", "GitHub"],
        }
      })
    })

    this.app.get("/health", (req, res) => {
      res.json({ status: "OK", timestamp: new Date().toISOString() });
    });



    this.app.use("/api/auth", authRoutes);

    this.app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });
  }

  // ⬇️ TANPA private
  errorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
