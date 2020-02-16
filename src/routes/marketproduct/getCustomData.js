import { validationResult, query } from "express-validator";
import { Book, BookImage, OrderDetail, Order } from "../../models";
import { apiResponse } from "../../helpers";
import { SALE_STATUS, CODES_CUSTOM_DATA } from "../../constants/product";
import moment from "moment";
import sequelize from "../../models/sequelize";

export default [
  query("code")
    .isIn(Object.values(CODES_CUSTOM_DATA))
    .withMessage(`code is invalid`),
  query("page")
    .if(value => value !== undefined)
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("page_size")
    .if(value => value !== undefined)
    .isInt({ min: 1 })
    .withMessage("Page size must be greater than or equal to 1"),
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
        const page = parseInt(req.query.page || 1);
        const page_size = parseInt(req.query.page_size || 10);
        let rows, count;
        switch (code) {
          case CODES_CUSTOM_DATA.BOOK_NEW: {
            ({ rows, count } = await getProductNew(page, page_size));
            break;
          }
          case CODES_CUSTOM_DATA.BOOK_FORTHCOMING: {
            ({ rows, count } = await getProductForthcoming(page, page_size));
            break;
          }
          case CODES_CUSTOM_DATA.BOOK_BEST_SELLER: {
            ({ rows, count } = await getProductBestSeller(page, page_size));
            break;
          }
          default: {
            console.log("Have error");
          }
        }
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

const attr = [
  "name",
  "short_name",
  "id",
  "root_price",
  "sale_price",
  "sale_status",
  "updated_at",
  "quantity_in_stock",
  "url",
  "on_sale_date"
];

const getProductNew = async (page, page_size) => {
  let { count, rows } = await Book.findAndCountAll({
    where: {
      $and: [
        {
          is_active: true
        },
        {
          sale_status: { $in: [SALE_STATUS.AVAILABLE] }
        }
      ]
    },
    include: [
      {
        model: BookImage,
        as: "images",
        attributes: ["url"]
      }
    ],
    attributes: attr,
    order: [["updated_at", "DESC"]],
    limit: page_size,
    offset: (page - 1) * page_size
  });
  return {
    rows,
    count
  };
};

const getProductForthcoming = async (page, page_size) => {
  const { count, rows } = await Book.findAndCountAll({
    where: {
      $and: [
        {
          is_active: true
        },
        {
          sale_status: { $in: [SALE_STATUS.UPCOMING] }
        },
        {
          on_sale_date: { $ne: null }
        },
        {
          on_sale_date: { $gt: moment() }
        }
      ]
    },
    include: [
      {
        model: BookImage,
        as: "images",
        attributes: ["url"]
      }
    ],
    attributes: [...attr, "on_sale_date"],
    order: [["updated_at", "DESC"]],
    limit: page_size,
    offset: (page - 1) * page_size
  });
  return {
    rows,
    count
  };
};

const getProductBestSeller = async (page, page_size) => {
  const { count, rows } = await Book.findAndCountAll({
    where: {
      $and: [
        {
          is_active: true
        },
        {
          sale_status: { $in: [SALE_STATUS.AVAILABLE] }
        }
      ]
    },
    include: [
      {
        model: BookImage,
        as: "images",
        attributes: ["url"]
      },
      {
        model: OrderDetail,
        attributes: [],
        required: true
      }
    ],
    attributes: [...attr, [sequelize.fn("COUNT", "Book.id"), "cnt"]],
    group: ["Book.id"],
    order: [[sequelize.literal("cnt"), "DESC"]],
    limit: page_size,
    offset: (page - 1) * page_size
  });
  return {
    rows,
    count: count.length
  };
};
