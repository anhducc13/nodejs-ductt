import { param, body, validationResult } from "express-validator";
import { Author } from "../../models";
import { apiResponse, commonHelpers } from "../../helpers";

export default [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a integer > 0"),
  body("name")
    .notEmpty()
    .withMessage("Field name required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Author name between 6 and 255 character")
    .custom((value, { req }) => {
      return Author.findOne({
        where: { name: value, id: { $ne: req.params.id } }
      }).then(author => {
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
        Author.findOne({ where: { id: req.params.id } })
          .then(author => {
            if (!author) {
              return apiResponse.notFoundResponse(res, "Not found author");
            } else {
              if (req.body.name) {
                author.name = req.body.name;
                author.url = commonHelpers.generateUrl(req.body.name);
              }
              if (req.body.description) {
                author.description = req.body.description;
              }
              if (req.body.rate) {
                author.rate = req.body.rate;
              }
              if (req.body.is_active) {
                author.is_active = req.body.is_active;
              }
              author.save().then(() => {
                return apiResponse.successResponseWithData(
                  res,
                  "Update success",
                  author
                );
              });
            }
          })
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
