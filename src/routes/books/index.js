import { Router } from "express";
import createBook from "./createBook";
import detailBook from "./detailBook";
import listBooks from "./listBooks";

const books = Router();

books.post("/", createBook);
books.get("/:id", detailBook);
books.get("/", listBooks);

export default books;