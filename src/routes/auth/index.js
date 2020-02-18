import { Router } from "express";
import register from "./register";
import login from "./login";
import getInfo from "./getInfo";
import { isAuthenticated } from "./authenticate";

const auth = Router();

auth.post("/register", register);
auth.post("/login", login)
auth.get("/getInfo", isAuthenticated, getInfo);

export default auth;
