import { param, body, validationResult } from "express-validator";
import { Category } from "../../models";
import { apiResponse, commonHelpers } from "../../helpers";

export default [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a integer > 0"),
  body("short_name")
    .if(value => value !== undefined && value !== null)
    .isString()
    .withMessage("Short name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Category short name between 6 and 255 character")
    .custom((value, { req }) => {
      return Category.findOne({
        where: { short_name: value, id: { $ne: req.params.id } }
      }).then(cat => {
        if (cat) {
          return Promise.reject("Categories short name already in use");
        }
      });
    }),
  body("name")
    .if(value => value !== undefined && value !== null)
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Category name between 6 and 255 character")
    .custom((value, { req }) => {
      return Category.findOne({
        where: { name: value, id: { $ne: req.params.id } }
      }).then(cat => {
        if (cat) {
          return Promise.reject("Categories name already in use");
        }
      });
    }),
  body("description")
    .if(value => value !== undefined && value !== null)
    .isString()
    .withMessage("Description must be a string"),
  body("is_active")
    .if(value => [true, false].includes(value))
    .isBoolean()
    .withMessage("Status must be boolean type"),
  body("parent_id")
    .if(value => value !== undefined || value === null)
    .isInt({ min: 1 })
    .withMessage(" Parent ID must be a integer > 0")
    .custom((value, { req }) => {
      return Category.findOne({ where: { id: value } }).then(cat => {
        if (cat) {
          if (cat.id == req.params.id) {
            return Promise.reject("Parent can't be itself");
          }
          if (cat.parent_id) {
            return Promise.reject("Categories tree should be have 2 level");
          }
        } else {
          return Promise.reject("This parent is not exist");
        }
      });
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
        const cat = await Category.findOne({ where: { id: req.params.id } });
        if (!cat) {
          return apiResponse.notFoundResponse(res, "Not found author");
        } else {
          cat.short_name = req.body.short_name;
          cat.url = commonHelpers.generateUrl(req.body.short_name);
          cat.name = req.body.name;
          cat.description = req.body.description;
          cat.is_active = !!req.body.is_active;
          await cat.setChildren([]);
          cat.parent_id = req.body.parent_id;
          await cat.save();
          return apiResponse.successResponseWithData(
            res,
            "Update success",
            cat
          );
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
