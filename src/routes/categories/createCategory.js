import { body, validationResult } from "express-validator";
import { Category } from "../../models";
import { checkDuplicateCategory } from "../../middlewares/duplicate";
import { validateString, validateNumber } from "../../middlewares/common";
import { apiResponse, commonHelpers } from "../../helpers";

export default [
  validateString("short_name", "body", { required: true }),
  validateString("name", "body", { required: true }),
  checkDuplicateCategory(["short_name", "short_name", "body"]),
  checkDuplicateCategory(["name", "name", "body"]),
  validateString("description", "body"),
  validateIncludes("is_active", "body", [true, false]),
  validateNumber("parent_id", "body"),
  async (req, res) => {
    try {
      let newCategory = {
        name: req.body.name,
        short_name: req.body.short_name
      };
      newCategory.url = commonHelpers.generateUrl(req.body.short_name);
      if (req.body.parent_id) {
        newCategory.parent_id = req.body.parent_id;
      }
      if (req.body.description) {
        newCategory.description = req.body.description;
      }
      if (req.body.is_active) {
        newCategory.is_active = req.body.is_active;
      }
      const c = await Category.create(newCategory);
      return apiResponse.successResponseWithData(
        res,
        "Create Category Success.",
        c
      );
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
]

export default [
  body("short_name")
    .notEmpty()
    .withMessage("Field short name required")
    .isString()
    .withMessage("Short name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Category short name between 6 and 255 character")
    .custom(value => {
      return Category.findOne({ where: { short_name: value } }).then(cat => {
        if (cat) {
          return Promise.reject("Categories short name already in use");
        }
      });
    }),
  body("name")
    .notEmpty()
    .withMessage("Field name required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 6, max: 255 })
    .withMessage("Category name between 6 and 255 character")
    .custom(value => {
      return Category.findOne({ where: { name: value } }).then(cat => {
        if (cat) {
          return Promise.reject("Categories name already in use");
        }
      });
    }),
  body("description")
    .if(value => value !== undefined || value === null)
    .isString()
    .withMessage("Description must be a string"),
  body("is_active")
    .if(value => [true, false].includes(value))
    .isBoolean()
    .withMessage("Status must be boolean type"),
  body("parent_id")
    .if(value => value !== undefined && value !== null)
    .isInt({ min: 1 })
    .withMessage(" Parent ID must be a integer > 0")
    .custom(value => {
      return Category.findOne({ where: { id: value } }).then(cat => {
        if (cat) {
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
        let newCategory = {
          name: req.body.name,
          short_name: req.body.short_name
        };
        newCategory.url = commonHelpers.generateUrl(req.body.short_name);
        if (req.body.parent_id) {
          newCategory.parent_id = req.body.parent_id;
        }
        if (req.body.description) {
          newCategory.description = req.body.description;
        }
        if (req.body.is_active) {
          newCategory.is_active = req.body.is_active;
        }
        const c = await Category.create(newCategory);
        return apiResponse.successResponseWithData(
          res,
          "Create Category Success.",
          c
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
