import { validationResult, query } from "express-validator";
import { Ward } from "../../models";
import { apiResponse } from "../../helpers";

export default [
  query("district_id")
    .isString()
    .trim()
    .withMessage("District id must be a string"),
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
        const district_id = req.query.district_id;
        const wards = await Ward.findAll({
          where: {
            district_id: district_id
          }
        });
        return apiResponse.successResponseWithData(res, `Success`, {
          total_items: wards.length,
          results: wards
        });
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
