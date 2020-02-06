import { validationResult, query } from "express-validator";
import { Book } from "../../models";
import { apiResponse } from "../../helpers";

const availableSortFields = [
  "id",
  "name",
  "url",
  "quantity_in_stock",
  "sale_price"
];
const availableOrderTypes = ["descend", "ascend"];
const saleStatus = ["UPCOMING", "AVAILABLE", "OUTOFSTOCK", "SUSPENSION"];

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
  query("sale_status")
    .if(value => value !== undefined)
    .isString()
    .trim()
    .withMessage("Sale status must be a string")
    .custom(value => {
      const arrStatus = value.split(",");
      const ok = arrStatus.every(v => saleStatus.includes(v));
      if (ok === false) {
        throw new Error("Sale status invalid format");
      }
      return true;
    }),
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
          isActiveIn = isActiveIn.filter(
            v => v === (req.query.is_active === "true")
          );
        }
        const inSaleStatus = req.query.sale_status
          ? req.query.sale_status.split(",")
          : saleStatus;
        const { count, rows } = await Book.findAndCountAll({
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
              {
                sale_status: { $in: inSaleStatus }
              }
            ]
          },
          order: [[sort_by, order_by]],
          limit: parseInt(page_size),
          offset: (page - 1) * page_size
        });
        return apiResponse.successResponseWithData(
          res,
          `Have ${rows.length} Books`,
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
