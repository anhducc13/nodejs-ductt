import { validationResult, query } from "express-validator";
import { Category } from "../../models";
import { apiResponse } from "../../helpers";
import { CODES_EXTRA_DATA } from "../../constants/product";

export default [
  query("code")
    .isIn(Object.values(CODES_EXTRA_DATA))
    .withMessage(`code is invalid`),
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
        const code = req.query.code;
        let result;
        switch (code) {
          case CODES_EXTRA_DATA.CATEGORIES: {
            const cats = await getCategories();
            result = {
              results: cats
            };
            break;
          }
          default: {
            console.log("Have error");
          }
        }
        return apiResponse.successResponseWithData(
          res,
          `Success`,
          result
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];

const attrCats = ["name", "short_name", "id", "parent_id", "is_active", "url"];

const getCategories = async () => {
  const cats = await Category.findAll({
    where: {
      is_active: true
    },
    attributes: attrCats,
    order: [["name", "ASC"]],
  });
  return cats.map(c => {
    const level = c.dataValues.parent_id ? 2 : 1;
    return {
      ...c.dataValues,
      level,
    };
  });
};