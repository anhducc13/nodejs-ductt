import { validationResult, query } from "express-validator";
import { Author } from "../../models";
import { apiResponse } from "../../helpers";

const availableSortFields = ["id", "name", "url", "rate"];
const availableOrderTypes = ["descend", "ascend"];

export default [
  query("page")
    .if(value => value !== undefined)
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("page_size")
    .if(value => value !== undefined)
    .isInt({ min: 1 })
    .withMessage("Page size must be greater than or equal to 1"),
  query("q")
    .if(value => value !== undefined)
    .isString()
    .trim()
    .withMessage("Text search must be a string"),
  query("sort_by")
    .if(value => value !== undefined)
    .isIn(availableSortFields)
    .withMessage(
      `sort field must be one of fields: ${availableSortFields.join(", ")}`
    ),
  query("order_by")
    .if(value => value !== undefined)
    .isIn(availableOrderTypes)
    .withMessage(
      `order type must be one of types: ${availableOrderTypes.join(", ")}`
    ),
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
        const page = parseInt(req.query.page || 1);
        const page_size = parseInt(req.query.page_size || 10);
        const q = req.query.q || "";
        const sort_by = req.query.sort_by || "id";
        let order_by = req.query.order_by || "descend";
        order_by = order_by === "descend" ? "DESC" : "ASC";
        const { count, rows } = await Author.findAndCountAll({
          where: {
            $or: [{ name: { $like: `%${q}%` } }, { url: { $like: `%${q}%` } }]
          },
          order: [[sort_by, order_by]],
          limit: parseInt(page_size),
          offset: (page - 1) * page_size,
          attributes: ["id", "name", "url", "rate"]
        });
        return apiResponse.successResponseWithData(
          res,
          `Have ${rows.length} Author`,
          {
            total_items: count,
            results: rows,
            page,
            page_size
          }
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
