import { Router } from "express";
import getAll from "./getAll";

const cities = Router();

cities.get("/", getAll);

export default cities;
