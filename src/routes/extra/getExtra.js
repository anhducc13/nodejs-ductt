import { Author, Publisher, Category } from "../../models";
import { apiResponse } from "../../helpers";

export default [
  async (req, res) => {
    try {
      const authors = await Author.findAll({
        where: { is_active: true },
        attributes: ["id", "name", "url"]
      });
      const publishers = await Publisher.findAll({
        where: { is_active: true },
        attributes: ["id", "name", "url"]
      });
      const categories = await Category.findAll({
        where: { is_active: true },
        attributes: ["id", "name", "short_name", "parent_id", "url"]
      });
      return apiResponse.successResponseWithData(res, `Extra data`, {
        total_items: {
          authors: authors.length,
          publishers: publishers.length,
          categories: categories.length
        },
        results: {
          authors,
          publishers,
          categories
        }
      });
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
