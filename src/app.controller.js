
import cors from "cors";
import connectDB from "./DB/connecion.js";
import userRouter from "./modules/user/user.controller.js";
import moodRouter from "./modules/Mood/Mood.controller.js";

export const bootstrap = async (express, app) => {
  app.use(cors());
  app.use(express.json());

  await connectDB();

  app.use("/user", userRouter);
  app.use("/mood", moodRouter);
  (cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      
    ],

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
    app.use((req, res) => {
      res.status(404).json({ success: false, message: "Route not found" });
    }));

  app.use((error, req, res, next) => {
    let status = typeof error.cause === "number" ? error.cause : 500;
    if (error.statusCode) {
      status = error.statusCode;
    }
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      status = 401;
    }
    res.status(status).json({ success: false, message: error.message });
  });
};
