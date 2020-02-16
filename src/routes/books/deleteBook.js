import { param, validationResult } from "express-validator";
import { Book } from "../../models";
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
        const book = await Book.findOne({
          where: { id: req.params.id }
        });
        if (!book) {
          return apiResponse.notFoundResponse(res, "Not found book");
        } else {
          await book.destroy();
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
