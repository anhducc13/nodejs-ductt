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
        const cat = await Category.findOne({
          where: { id: req.params.id },
          include: [
            {
              model: Category,
              as: "parent",
              attributes: [
                "id",
                "parent_id",
                "name",
                "short_name",
                "description",
                "is_active",
                "url"
              ]
            }
          ],
          attributes: [
            "id",
            "parent_id",
            "name",
            "short_name",
            "description",
            "is_active",
            "url"
          ]
        });
        if (!cat) {
          return apiResponse.notFoundResponse(res, "Not found category");
        }
        return apiResponse.successResponseWithData(res, "Have 1 Category", cat);
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
