import { Router } from "express";
import getExtra from "./getExtra";

const extra = Router();

extra.get("/", getExtra);

export default extra;
