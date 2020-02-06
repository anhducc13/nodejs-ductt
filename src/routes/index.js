import { Router } from "express";
import auth from "./auth";
import authors from "./authors";
import publishers from "./publishers";
import extra from "./extra";
import categories from "./categories";
import books from "./books";

const routes = Router();

routes.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to ou API!" });
});

routes.use("/auth", auth);
routes.use("/authors", authors);
routes.use("/publishers", publishers);
routes.use("/extra", extra);
routes.use("/categories", categories);
routes.use("/books", books);

export default routes;
