import { validationResult, query } from "express-validator";
import { Category } from "../../models";
import { apiResponse } from "../../helpers";

const availableSortFields = ["id", "name", "url", "short_name"];
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
  query("is_active")
    .if(value => value !== undefined)
    .isIn(["true", "false"])
    .withMessage("Status must be boolean type (true or false)"),
  query("is_parent")
    .if(value => value !== undefined)
    .isIn(["true", "false"])
    .withMessage("Is parent must be boolean type (true or false)"),
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
        let isActiveIn = [true, false];
        if (req.query.is_active) {
          isActiveIn = isActiveIn.filter(v => v === (req.query.is_active === "true"));
        }
        let queryIsParent = {}
        if (req.query.is_parent) {
          if (req.query.is_parent === "true") {
            queryIsParent = {
              parent_id: { $ne: null }
            };
          } else {
            queryIsParent = {
              parent_id: null
            };
          }
        }
        const { count, rows } = await Category.findAndCountAll({
          where: {
            $and: [
              {
                $or: [
                  { name: { $like: `%${q}%` } },
                  { short_name: { $like: `%${q}%` } },
                  { url: { $like: `%${q}%` } }
                ]
              },
              {
                is_active: { $in: isActiveIn }
              },
              queryIsParent
            ]
          },
          order: [[sort_by, order_by]],
          limit: parseInt(page_size),
          offset: (page - 1) * page_size,
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
        return apiResponse.successResponseWithData(
          res,
          `Have ${rows.length} Categories`,
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
