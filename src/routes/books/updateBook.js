import { body, validationResult, param } from "express-validator";
import { Category, Book, Author, Publisher, BookImage } from "../../models";
import { apiResponse, commonHelpers, validateHelpers } from "../../helpers";
import moment from "moment";

export default [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a integer > 0"),
  body("short_name")
    .notEmpty()
    .withMessage("Field short name required")
    .isString()
    .withMessage("Short name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Book short name between 6 and 255 character")
    .custom((value, { req }) => {
      return Book.findOne({
        where: { short_name: value, id: { $ne: req.params.id } }
      }).then(b => {
        if (b) {
          return Promise.reject("Book short name already in use");
        }
      });
    }),
  body("name")
    .notEmpty()
    .withMessage("Field name required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Book name between 6 and 255 character")
    .custom((value, { req }) => {
      return Book.findOne({
        where: { name: value, id: { $ne: req.params.id } }
      }).then(b => {
        if (b) {
          return Promise.reject("Book name already in use");
        }
      });
    }),
  body("short_description")
    .if(value => value !== undefined && value !== null)
    .isString()
    .withMessage("Short description must be a string"),
  body("description")
    .if(value => value !== undefined && value !== null)
    .isString()
    .withMessage("Description must be a string"),
  body("is_active")
    .if(value => [true, false].includes(value))
    .isBoolean()
    .withMessage("Status must be boolean type"),
  body("release_date")
    .if(value => value !== undefined && value !== null)
    .custom(value => {
      if (!validateHelpers.isValidDate(value)) {
        throw new Error("Format date: DD-MM-YYYY");
      }
    }),
  body("number_of_pages")
    .if(value => value !== undefined && value !== null)
    .isInt({ min: 1 })
    .withMessage("Number of page must be integer >= 1"),
  body("weight")
    .if(value => value !== undefined && value !== null)
    .isFloat({ min: 0 })
    .withMessage("Weight must be >= 0"),
  body("size")
    .if(value => value !== undefined && value !== null)
    .isString()
    .withMessage("Size must be a string"),
  body("on_sale_date")
    .if(value => value !== undefined && value !== null)
    .custom(value => {
      if (!validateHelpers.isValidDate(value)) {
        throw new Error("Format date: DD-MM-YYYY");
      }
    }),
  body("import_price")
    .if(value => value !== undefined && value !== null)
    .isFloat({ min: 0 })
    .withMessage("import_price must be >= 0"),
  body("root_price")
    .if(value => value !== undefined && value !== null)
    .isFloat({ min: 0 })
    .withMessage("root_price must be >= 0"),
  body("sale_price")
    .if(value => value !== undefined && value !== null)
    .isFloat({ min: 0 })
    .withMessage("sale_price must be >= 0"),
  body("quantity_in_stock")
    .if(value => value !== undefined && value !== null)
    .isInt({ min: 0 })
    .withMessage("quantity_in_stock must be >= 0"),
  body("demo")
    .if(value => value !== undefined && value !== null)
    .isURL()
    .withMessage("demo file must be url"),
  body("sale_status")
    .if(value => value !== undefined && value !== null)
    .isIn(["UPCOMING", "AVAILABLE", "OUTOFSTOCK", "SUSPENSION"])
    .withMessage(
      "sale_status must be in [UPCOMING,AVAILABLE,OUTOFSTOCK,SUSPENSION]"
    ),
  body("category_ids")
    .if(value => value !== undefined && value !== null)
    .isArray()
    .withMessage("category_ids must be array")
    .custom(async value => {
      if (Array.isArray(value)) {
        try {
          const cats = await Category.findAll({
            where: { id: { $in: value } }
          });
          if (cats.length !== value.length) {
            return Promise.reject(`One of category id ${value} not exist`);
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }),
  body("images")
    .if(value => value !== undefined && value !== null)
    .isArray()
    .withMessage("images must be array"),
  body("author_ids")
    .if(value => value !== undefined && value !== null)
    .isArray()
    .withMessage("author_ids must be array")
    .custom(async value => {
      if (Array.isArray(value)) {
        try {
          const aus = await Author.findAll({ where: { id: { $in: value } } });
          if (aus.length !== value.length) {
            return Promise.reject(`One of authors id ${value} not exist`);
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }),
  body("publisher_id")
    .if(value => value !== undefined && value !== null)
    .isInt({ min: 0 })
    .withMessage("publisher_id must be integer")
    .custom(async value => {
      try {
        const pubs = await Publisher.findAll({ where: { id: value } });
        if (pubs.length === 0) {
          return Promise.reject(`Publisher with id ${value} not exist`);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array().map(e => e.msg)
        );
      } else {
        const book = await Book.findOne({ where: { id: req.params.id } });
        if (!book) {
          return apiResponse.notFoundResponse(res, "Not found author");
        } else {
          book.name = req.body.name;
          book.short_name = req.body.short_name;
          book.url = commonHelpers.generateUrl(req.body.short_name);
          book.short_description = req.body.short_description;
          book.description = req.body.description;
          book.is_active = !!req.body.is_active;
          book.number_of_pages = req.body.number_of_pages;
          book.weight = req.body.weight;
          book.size = req.body.size;
          book.import_price = req.body.import_price;
          book.root_price = req.body.root_price;
          book.sale_price = req.body.sale_price;
          book.quantity_in_stock = req.body.quantity_in_stock;
          book.demo = req.body.demo;
          book.sale_status = req.body.sale_status;
          book.pulisher_id = req.body.pulisher_id;
          if (req.body.release_date) {
            book.release_date = moment(
              req.body.release_date,
              "DD-MM-YYYY"
            );
          } else {
            book.release_date = null;
          }
          if (req.body.on_sale_date) {
            book.on_sale_date = moment(
              req.body.on_sale_date,
              "DD-MM-YYYY"
            );
          } else {
            book.on_sale_date = null;
          }
          if (req.body.category_ids) {
            await book.setCategories([]);
            req.body.category_ids.forEach(async ele => {
              const cat = await Category.findOne({ where: { id: ele } });
              if (cat) {
                await book.addCategory(cat);
              }
            });
          }
          if (req.body.author_ids) {
            await book.setAuthors([]);
            req.body.author_ids.forEach(async ele => {
              const a = await Author.findOne({ where: { id: ele } });
              if (a) {
                await book.addAuthor(a);
              }
            });
          }
          if (req.body.images) {
            await BookImage.destroy({
              where: {
                book_id: book.id
              }
            });
            req.body.images.forEach(async ele => {
              try {
                const img = await BookImage.create({
                  url: ele,
                  book_id: book.id
                });
                if (img) {
                  await book.addImage(img);
                }
              } catch (err) {
                console.log(err);
                return apiResponse.errorResponse(res, err);
              }
            });
          }
          await book.save();
          return apiResponse.successResponseWithData(
            res,
            "Update Book Success.",
            book
          );
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
