import express from "express";
import cors from "cors";
import UserRoutes from "./Routes/Usuario.Routes.js";
import morgan from "morgan";
import config from "./config.js";

const app = express();

// settings
app.set("port", config.port);

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api", UserRoutes);

export default app;