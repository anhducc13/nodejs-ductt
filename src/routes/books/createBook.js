import { body, validationResult } from "express-validator";
import { Category, Book, Author, Publisher, BookImage } from "../../models";
import { apiResponse, commonHelpers, validateHelpers } from "../../helpers";
import moment from "moment";

export default [
  body("short_name")
    .notEmpty()
    .withMessage("Field short name required")
    .isString()
    .withMessage("Short name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Book short name between 6 and 255 character")
    .custom(value => {
      return Book.findOne({ where: { short_name: value } }).then(b => {
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
    .custom(value => {
      return Book.findOne({ where: { name: value } }).then(b => {
        if (b) {
          return Promise.reject("Book name already in use");
        }
      });
    }),
  body("short_description")
    .if(value => value !== undefined)
    .isString()
    .withMessage("Short description must be a string"),
  body("description")
    .if(value => value !== undefined)
    .isString()
    .withMessage("Description must be a string"),
  body("is_active")
    .if(value => [true, false].includes(value))
    .isBoolean()
    .withMessage("Status must be boolean type"),
  body("release_date")
    .if(value => value !== undefined)
    .custom(value => {
      if (!validateHelpers.isValidDate(value)) {
        throw new Error("Format date: DD-MM-YYYY");
      }
    }),
  body("number_of_pages")
    .if(value => value !== undefined)
    .isInt({ min: 1 })
    .withMessage("Number of page must be integer >= 1"),
  body("weight")
    .if(value => value !== undefined)
    .isFloat({ min: 0 })
    .withMessage("Weight must be >= 0"),
  body("size")
    .if(value => value !== undefined)
    .isString()
    .withMessage("Size must be a string"),
  body("on_sale_date").if(value => value !== undefined),
  body("import_price")
    .if(value => value !== undefined)
    .isFloat({ min: 0 })
    .withMessage("import_price must be >= 0"),
  body("root_price")
    .if(value => value !== undefined)
    .isFloat({ min: 0 })
    .withMessage("root_price must be >= 0"),
  body("sale_price")
    .if(value => value !== undefined)
    .isFloat({ min: 0 })
    .withMessage("sale_price must be >= 0"),
  body("quantity_in_stock")
    .if(value => value !== undefined)
    .isInt({ min: 0 })
    .withMessage("quantity_in_stock must be >= 0"),
  body("demo")
    .if(value => value !== undefined)
    .isURL()
    .withMessage("demo file must be url"),
  body("sale_status")
    .if(value => value !== undefined)
    .isIn(["UPCOMING", "AVAILABLE", "OUTOFSTOCK", "SUSPENSION"])
    .withMessage(
      "sale_status must be in [UPCOMING,AVAILABLE,OUTOFSTOCK,SUSPENSION]"
    ),
  body("category_ids")
    .if(value => value !== undefined)
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
    .if(value => value !== undefined)
    .isArray()
    .withMessage("images must be array"),
  body("author_ids")
    .if(value => value !== undefined)
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
    .if(value => value !== undefined)
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
        let newBook = {
          name: req.body.name,
          short_name: req.body.short_name,
          url: commonHelpers.generateUrl(req.body.short_name)
        };
        if (req.body.short_description) {
          newBook.parent_id = req.body.parent_id;
        }
        if (req.body.description) {
          newBook.description = req.body.description;
        }
        if (req.body.is_active) {
          newBook.is_active = req.body.is_active;
        }
        if (req.body.number_of_pages) {
          newBook.number_of_pages = req.body.number_of_pages;
        }
        if (req.body.weight) {
          newBook.weight = req.body.weight;
        }
        if (req.body.size) {
          newBook.size = req.body.size;
        }
        if (req.body.import_price) {
          newBook.import_price = req.body.import_price;
        }
        if (req.body.root_price) {
          newBook.root_price = req.body.root_price;
        }
        if (req.body.sale_price) {
          newBook.sale_price = req.body.sale_price;
        }
        if (req.body.quantity_in_stock) {
          newBook.quantity_in_stock = req.body.quantity_in_stock;
        }
        if (req.body.demo) {
          newBook.demo = req.body.demo;
        }
        if (req.body.sale_status) {
          newBook.sale_status = req.body.sale_status;
        }
        if (req.body.pulisher_id) {
          newBook.pulisher_id = req.body.pulisher_id;
        }
        if (req.body.release_date) {
          newBook.body.release_date = moment(
            req.body.release_date,
            "DD-MM-YYYY"
          );
        }
        if (req.body.on_sale_date) {
          newBook.body.on_sale_date = moment(
            req.body.on_sale_date,
            "DD-MM-YYYY"
          );
        }
        const book = await Book.create(newBook);
        if (req.body.category_ids) {
          req.body.category_ids.forEach(async ele => {
            const cat = await Category.findOne({ where: { id: ele } });
            if (cat) {
              await book.addCategory(cat);
            }
          });
        }
        if (req.body.author_ids) {
          req.body.author_ids.forEach(async ele => {
            const a = await Author.findOne({ where: { id: ele } });
            if (a) {
              await book.addAuthor(a);
            }
          });
        }
        if (req.body.images) {
          req.body.images.forEach(async ele => {
            try {
              const img = await BookImage.create({
                url: ele,
                book_id: book.id
              });
              if (img) {
                await book.addBookImage(img);
              }
            } catch (err) {
              console.log(err);
              return apiResponse.errorResponse(res, err);
            }
          });
        }
        return apiResponse.successResponseWithData(
          res,
          "Create Book Success.",
          book
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
