import { Router } from "express";
import createOrder from "./createOrder";
import { apiResponse } from "../../helpers";
import { validateString } from "../../middlewares/common";

const orders = Router();

orders.post("/", validateString("comment", "body"), (req, res) => {
  return apiResponse.successResponseWithData(res, "Success", "abc");
});

export default orders;
