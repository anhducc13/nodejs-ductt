import { Router } from "express";
import getCustomData from "./getCustomData";
import getExtraData from "./getExtraData";
import saleCategory from "./saleCategory";
import saleProduct from "./saleProduct";

const marketproduct = Router();

marketproduct.get("/getCustomData", getCustomData);
marketproduct.get("/getExtraData", getExtraData);
marketproduct.get("/saleCategory/:slug", saleCategory);
marketproduct.get("/saleProduct/:slug", saleProduct);

export default marketproduct;