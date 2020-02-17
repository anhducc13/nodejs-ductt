import { validationResult, query } from "express-validator";
import { Category, Book, BookImage } from "../../models";
import { apiResponse } from "../../helpers";
import { SALE_STATUS } from "../../constants/product";

const availableSortFields = ["name", "sale_price", "created_at"];
const availableOrderTypes = ["desc", "asc"];

export default [
  query("page")
    .if(value => value !== undefined)
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("page_size")
    .if(value => value !== undefined)
    .isInt({ min: 1 })
    .withMessage("Page size must be greater than or equal to 1"),
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
        const catSlug = req.params.slug;
        const currCat = await Category.findOne({
          where: {
            url: catSlug
          }
        });
        if (currCat) {
          const page = parseInt(req.query.page || 1);
          const page_size = parseInt(req.query.page_size || 20);
          const sort_by = req.query.sort_by || "updated_at";
          const order_by = req.query.order_by || "desc";
          const { count, rows } = await Book.findAndCountAll({
            where: {
              $and: [
                {
                  is_active: true
                },
                {
                  sale_status: {
                    $in: [SALE_STATUS.AVAILABLE, SALE_STATUS.UPCOMING]
                  }
                }
              ]
            },
            include: [
              {
                model: Category,
                as: "categories",
                through: {
                  where: {
                    category_id: currCat.id
                  },
                  attributes: []
                },
                attributes: [],
                required: true
              },
              {
                model: BookImage,
                as: "images",
                attributes: ["url"]
              }
            ],
            attributes: [
              "name",
              "short_name",
              "id",
              "root_price",
              "sale_price",
              "sale_status",
              "created_at",
              "updated_at",
              "quantity_in_stock",
              "url",
              "on_sale_date"
            ],
            order: [[sort_by, order_by]],
            limit: page_size,
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
        } else {
          return apiResponse.notFoundResponse(res, "Not found category");
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
