// import { validationResult, query } from "express-validator";
import { Category } from "../../models";
import { apiResponse } from "../../helpers";
import { validateString, validateNumber, validateIncludes } from "../../middlewares/common";

const availableSortFields = ["id", "name", "url", "short_name"];
const availableOrderTypes = ["descend", "ascend"];

export default [
  validateNumber("page", "query", { min: 1 }),
  validateNumber("page_size", "query", { min: 1 }),
  validateString("q", "query"),
  validateIncludes("sort_by", "query", availableSortFields),
  validateIncludes("order_by", "query", availableOrderTypes),
  validateIncludes("is_active", "query", ["true", "false"]),
  validateIncludes("is_parent", "query", ["true", "false"]),
  async (req, res) => {
    try {
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
        if (req.query.is_parent === "false") {
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
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];