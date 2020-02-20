import { Router } from "express";
import getAll from "./getAll";

const districts = Router();

districts.get("/", getAll);

export default districts;
