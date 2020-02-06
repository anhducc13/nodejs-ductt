import { Router } from "express";
import register from "./register";
import login from "./login";

const auth = Router();

auth.post("/register", register);
auth.post("/login", login)

export default auth;
