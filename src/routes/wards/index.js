import { Router } from "express";
import getAll from "./getAll";

const wards = Router();

wards.get("/", getAll);

export default wards;
