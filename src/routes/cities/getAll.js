import { City } from "../../models";
import { apiResponse } from "../../helpers";

export default [
  async (req, res) => {
    try {
      const cities = await City.findAll();
      return apiResponse.successResponseWithData(res, `Extra data`, {
        total_items: cities.length,
        results: cities
      });
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
