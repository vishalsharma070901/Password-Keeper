import express from "express";
import { isAuth } from "../middleware/auth";
import {
  createPassword,
  deletePassword,
  getAll,
  modifyPassword,
  sharePassword,
} from "../controller/password.controller";

const PasswordRouter = express.Router();

PasswordRouter.get("/", isAuth, getAll);
PasswordRouter.post("/create", isAuth, createPassword);
PasswordRouter.put("/update/:id", isAuth, modifyPassword);
PasswordRouter.delete("/delete/:id", isAuth, deletePassword);
PasswordRouter.post("/share/:id", isAuth, sharePassword);

export default PasswordRouter;
