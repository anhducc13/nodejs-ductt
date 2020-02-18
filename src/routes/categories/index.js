import { Router } from "express";
import createCategory from "./createCategory";
import updateCategory from "./updateCategory";
import detailCategory from "./detailCategory";
import deleteCategory from "./deleteCategory";
import listCategories from "./listCategories";
import { isAuthenticated } from "../auth/authenticate";

const categories = Router();

categories.get("/", isAuthenticated, listCategories);
categories.post("/", isAuthenticated, createCategory);
categories.put("/:id", isAuthenticated, updateCategory);
categories.get("/:id", isAuthenticated, detailCategory);
categories.delete("/:id", isAuthenticated, deleteCategory);

export default categories;