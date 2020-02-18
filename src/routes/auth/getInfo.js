import { apiResponse } from "../../helpers";

export default (req, res) => {
  return apiResponse.successResponseWithData(
    res,
    "Success.",
    { user: req.user }
  );

};