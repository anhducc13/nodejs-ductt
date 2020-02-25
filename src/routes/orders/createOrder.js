import { validationResult, body } from "express-validator";
import { apiResponse, validateHelpers } from "../../helpers";
import { SHIPPING_METHOD, PAYMENT_METHOD } from "../../constants/product";

export default [
  // body("shipping_method")
  //   .isIn(Object.values(SHIPPING_METHOD))
  //   .withMessage(
  //     `shipping_method must be in [${Object.values(SHIPPING_METHOD).join(",")}]`
  //   ),
  // body("payment_method")
  //   .isIn(Object.values(PAYMENT_METHOD))
  //   .withMessage(
  //     `payment_method must be in [${Object.values(PAYMENT_METHOD).join(",")}]`
  //   ),
  // body("final_payment")
  //   .isFloat(),
  // body("order_info")
  //   .isJSON()
  //   .withMessage("Order info must be a json")
  //   .custom(value => {
  //     const info = JSON.parse(value);
  //     if (validateHelpers.isValidInfo(info)) {
  //       return true;
  //     }
  //     return Promise.reject("Order info is invalid");
  //   }),
  // body("delivery_info")
  //   .isJSON()
  //   .withMessage("Delivery info must be a json")
  //   .custom(value => {
  //     const info = JSON.parse(value);
  //     if (validateHelpers.isValidInfo(info)) {
  //       return true;
  //     }
  //     return Promise.reject("Delivery info is invalid");
  //   }),
  // body("comment")
  //   .isString()
  //   .withMessage("Comment must be a string"),
  // body("products")
  //   .isArray()
  //   .withMessage("Product must be a array")
  //   .custom(value => {
  //     return true;
  //   }),
  async (req, res) => {
    // try {
    //   const errors = await validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return apiResponse.validationErrorWithData(
    //       res,
    //       "Validation Error.",
    //       errors.array().map(e => e.msg)
    //     );
    //   } else {
    // console.log(req.body);
    return apiResponse.successResponseWithData(res, "Success", "abc");
  }
  // } catch (err) {
  //   console.log(err);
  //   return apiResponse.errorResponse(res, err);
  // }
  // }
]