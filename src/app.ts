import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import "./config/passport";
import authRoutes from "./routes/auth.routes";
// import messageRoutes from "./routes/message.routes";
import { errorHandler } from "./middleware/errorHandler";
import connectDB from "./lib/mongodb";
// import passportConfig from "./lib/auth";

dotenv.config();

connectDB();
class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    // this.initializePassport();
    this.routes();
    this.errorHandling();
  }

  private config(): void {
    // Security
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    this.app.use(morgan("dev"));

    // Session
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || "your-session-secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          ttl: 14 * 24 * 60 * 60, // 14 days
        }),
        cookie: {
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
      })
    );

    // Passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  // private initializePassport(): void {
  //   passportConfig();
  // }

  private routes(): void {
    // Health check
    this.app.get("/health", (req, res) => {
      res.json({ status: "OK", timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use("/api/auth", authRoutes);
    // this.app.use("/api/messages", messageRoutes);

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });
  }

  private errorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
