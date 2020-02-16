import { Router } from "express";
import createBook from "./createBook";
import detailBook from "./detailBook";
import listBooks from "./listBooks";
import updateBook from "./updateBook";
import deleteBook from "./deleteBook";

const books = Router();

books.post("/", createBook);
books.get("/:id", detailBook);
books.get("/", listBooks);
books.put("/:id", updateBook);
books.delete("/:id", deleteBook)

export default books;