import { Category } from "../models";
import { apiResponse } from "../helpers";

export const checkDuplicateCategory = (name, position, ignoreMe = false) => {
  return async (req, res, next) => {
    const category_field = req[position][name[0]];
    let wherePre = {
      [name[1]]: category_field,
    };
    if (ignoreMe) {
      wherePre = {
        ...wherePre,
        id: { $ne: req.params.id }
      }
    }
    const cat = await Category.findOne({ where: wherePre });
    if (cat) {
      return apiResponse.validationErrorWithData(res, `Category with ${name[1]} ${category_field} already in use`);
    }
    return next();
  }
}