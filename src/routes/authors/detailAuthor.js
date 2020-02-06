import { param, validationResult } from "express-validator";
import { Author } from "../../models";
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
        const authors = await Author.findAll({ where: { id: req.params.id } });
        if (!authors.length) {
          return apiResponse.notFoundResponse(res, "Not found author");
        }
        return apiResponse.successResponseWithData(
          res,
          "Have 1 Author",
          authors[0]
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
