import { param, validationResult } from "express-validator";
import { Author } from "../../models";
import { apiResponse } from "../../helpers";

export default [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a integer > 0"),
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
              author.destroy()
                .then(() => {
                  return apiResponse.successResponseWithData(
                    res,
                    "Delete success",
                    null
                  );
                })
            }
          })
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
