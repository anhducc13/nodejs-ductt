import jwt from "jsonwebtoken";
import { apiResponse } from "../../helpers";
import config from "../../config";
import { User } from "../../models";

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers['x-token']

  if (token) {
    const jwtToken = token.split(" ");
    if (jwtToken.length > 1 && jwtToken[1]) {
      const bearerToken = jwtToken[1];
      try {
        const decoded = jwt.verify(bearerToken, config.secretKey);
        if (decoded && decoded.id) {
          const user = await User.findOne({ where: { id: decoded.id } })
          if (user && user.is_admin) {
            req.user = user;
            return next();
          }
        }
        return apiResponse.unauthorizedResponse(res, "Unauthorized");
      } catch (e) {
        console.log(e);
        return apiResponse.unauthorizedResponse(res, e.message || "Error", JSON.stringify(e));
      }
    }
    return apiResponse.unauthorizedResponse(res, "Token wrong format");
  }
  return apiResponse.unauthorizedResponse(res, "Not have token");
}