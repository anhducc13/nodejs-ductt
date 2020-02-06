import { param, validationResult } from "express-validator";
import { Publisher } from "../../models";
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
        Publisher.findOne({ where: { id: req.params.id } })
          .then(publisher => {
            if (!publisher) {
              return apiResponse.notFoundResponse(res, "Not found publisher");
            } else {
              publisher.destroy().then(() => {
                return apiResponse.successResponseWithData(
                  res,
                  "Delete success",
                  null
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
