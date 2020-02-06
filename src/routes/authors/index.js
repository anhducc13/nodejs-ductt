import { Router } from "express";
import createAuthor from "./createAuthor";
import detailAuthor from "./detailAuthor";
import listAuthors from "./listAuthors";
import updateAuthor from "./updateAuthor";
import deleteAuthor from "./deleteAuthor";

const authors = Router();


authors.post("/", createAuthor);
authors.get("/:id", detailAuthor);
authors.put("/:id", updateAuthor);
authors.delete("/:id", deleteAuthor);
authors.get("/", listAuthors);

export default authors;
