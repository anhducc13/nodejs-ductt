import { param, validationResult } from "express-validator";
import { Category, Book, BookImage, Author, Publisher } from "../../models";
import { apiResponse } from "../../helpers";

export default [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a integer > 0"),
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
        const book = await Book.findOne({
          where: { id: req.params.id },
          include: [
            {
              model: Category,
              as: "categories",
              through: {
                attributes: []
              },
              attributes: ["id", "name", "short_name", "is_active"]
            },
            {
              model: Author,
              as: "authors",
              through: {
                attributes: []
              },
              attributes: ["id", "name", "is_active"]
            },
            {
              model: Publisher,
              as: "publisher",
              attributes: ["id", "name", "is_active"]
            },
            {
              model: BookImage,
              as: "images",
              attributes: ["url"]
            }
          ]
        });
        if (!book) {
          return apiResponse.notFoundResponse(res, "Not found category");
        }
        return apiResponse.successResponseWithData(res, "Have 1 Book", book);
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
