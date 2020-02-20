import { validationResult, query } from "express-validator";
import { District } from "../../models";
import { apiResponse } from "../../helpers";

export default [
  query("city_id")
    .isString()
    .trim()
    .withMessage("City id must be a string"),
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
        const city_id = req.query.city_id
        const districts = await District.findAll({
          where: {
            city_id: city_id
          }
        });
        return apiResponse.successResponseWithData(res, `Success`, {
          total_items: districts.length,
          results: districts
        });
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
