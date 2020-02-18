import { Router } from "express";
import createBook from "./createBook";
import detailBook from "./detailBook";
import listBooks from "./listBooks";
import updateBook from "./updateBook";
import deleteBook from "./deleteBook";
import { isAuthenticated } from "../auth/authenticate";

const books = Router();

books.post("/", isAuthenticated, createBook);
books.get("/:id", isAuthenticated, detailBook);
books.get("/", isAuthenticated, listBooks);
books.put("/:id", isAuthenticated, updateBook);
books.delete("/:id", isAuthenticated, deleteBook)

export default books;