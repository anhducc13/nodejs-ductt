import { Router } from "express";
import createPublisher from "./createPublisher";
import detailPublisher from "./detailPublisher";
import listPublishers from "./listPublishers";
import updatePublisher from "./updatePublisher";
import deletePublisher from "./deletePublisher";

const publishers = Router();


publishers.post("/", createPublisher);
publishers.get("/:id", detailPublisher);
publishers.put("/:id", updatePublisher);
publishers.delete("/:id", deletePublisher);
publishers.get("/", listPublishers);

export default publishers;
