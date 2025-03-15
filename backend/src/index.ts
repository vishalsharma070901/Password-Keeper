import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import PasswordRouter from "./routes/password.routes";
import axios from "axios";
const app = express();


app.use(express.json());
app.set("trust proxy", 1);
app.use(cookieParser());
app.get("/", (req, res) => {
  console.log(process.env.PROD_URL);
});
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://pm17.netlify.app",
        "http://localhost:5173",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use("/api/user/", userRouter);
app.use("/api/password/", PasswordRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
