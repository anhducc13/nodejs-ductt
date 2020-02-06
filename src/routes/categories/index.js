import { Router } from "express";
import createCategory from "./createCategory";
import updateCategory from "./updateCategory";
import detailCategory from "./detailCategory";
import deleteCategory from "./deleteCategory";
import listCategories from "./listCategories";

const categories = Router();

categories.get("/", listCategories);
categories.post("/", createCategory);
categories.put("/:id", updateCategory);
categories.get("/:id", detailCategory);
categories.delete("/:id", deleteCategory);

export default categories;