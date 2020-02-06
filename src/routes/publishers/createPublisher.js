import { body, validationResult } from "express-validator";
import { Publisher } from "../../models";
import { apiResponse, commonHelpers } from "../../helpers";

export default [
  body("name")
    .notEmpty()
    .withMessage("Field name required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Publisher name between 6 and 255 character")
    .custom(value => {
      return Publisher.findOne({ where: { name: value } }).then(publisher => {
        if (publisher) {
          return Promise.reject("Publisher name already in use");
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
        let newPublisher = {
          name: req.body.name
        };
        newPublisher.url = commonHelpers.generateUrl(req.body.name);
        if (req.body.description) {
          newPublisher.description = req.body.description;
        }
        if (req.body.rate) {
          newPublisher.rate = req.body.rate;
        }
        if (req.body.is_active) {
          newPublisher.is_active = req.body.is_active;
        }
        const p = await Publisher.create(newPublisher);
        return apiResponse.successResponseWithData(
          res,
          "Create Publisher Success.",
          p
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
