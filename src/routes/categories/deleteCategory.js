import { param, validationResult } from "express-validator";
import { Category } from "../../models";
import { apiResponse } from "../../helpers";

export default [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a integer > 0"),
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
        const category = await Category.findOne({
          where: { id: req.params.id },
        });
        if (!category) {
          return apiResponse.notFoundResponse(res, "Not found category");
        } else {
          const currId = category.id;
          await category.destroy();
          const children = await Category.findAll({ where: { parent_id: currId }});
          children.forEach(async c => {
            c.parent_id = null;
            await c.save();
          })
          return apiResponse.successResponseWithData(
            res,
            "Delete success",
            null
          );
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];