import { validationResult, query } from "express-validator";
import { Category, Book, BookImage } from "../../models";
import { apiResponse } from "../../helpers";
import { SALE_STATUS } from "../../constants/product";

export default [
  async (req, res) => {
    try {
      const prodSlug = req.params.slug;
      const currProd = await Book.findOne({
        where: {
          $and: [
            {
              url: prodSlug
            },
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
              attributes: []
            },
            attributes: ["id", "name", "short_name", "is_active", "url"]
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
          "updated_at",
          "quantity_in_stock",
          "url",
          "on_sale_date",
          "short_description",
          "description"
        ]
      });
      if (currProd) {
        return apiResponse.successResponseWithData(res, `Success`, {
          results: currProd
        });
      } else {
        return apiResponse.notFoundResponse(res, "Not found book");
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
