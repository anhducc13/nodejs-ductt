import { body, validationResult } from "express-validator";
import { Author } from "../../models";
import { apiResponse, commonHelpers } from "../../helpers";

export default [
  body("name")
    .notEmpty()
    .withMessage("Field name required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Author name between 6 and 255 character")
    .custom((value) => {
      return Author.findOne({ where: { name: value }}).then(author => {
        if (author) {
          return Promise.reject("Author name already in use");
        }
      });
    }),
  body("description")
    .if(value => value !== undefined)
    .isString()
    .withMessage("Description must be a string"),
  body("rate")
    .if(value => value !== undefined)
    .isInt({ min: 0, max: 5 })
    .withMessage("Rate must be between 0 and 5"),
  body("is_active")
    .if(value => [true, false].includes(value))
    .isBoolean()
    .withMessage("Status must be boolean type"),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array().map(e => e.msg)
        );
      } else {
        let newAuthor = {
          name: req.body.name
        };
        newAuthor.url = commonHelpers.generateUrl(req.body.name);
        if (req.body.description) {
          newAuthor.description = req.body.description;
        }
        if (req.body.rate) {
          newAuthor.rate = req.body.rate;
        }
        if (req.body.is_active) {
          newAuthor.is_active = req.body.is_active;
        }
        Author.create(newAuthor)
          .then(author => {
            return apiResponse.successResponseWithData(
              res,
              "Create Author Success.",
              author
            );
          })
          .catch(err => {
            console.log(err);
            return apiResponse.errorResponse(res, err);
          });
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
