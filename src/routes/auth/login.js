import { body, validationResult, sanitizeBody, checkSchema } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user";
import { apiResponse } from "../../helpers";
import config from "../../config";

export default [
  checkSchema({
    username_or_email: {
      notEmpty: {
        errorMessage: "Username or Email required"
      }
    },
    password: {
      notEmpty: {
        errorMessage: "Password required"
      }
    }
  }),
  body("username_or_email").trim(),
  body("password").trim(),
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array().map(e => e.msg)
        );
      } else {
        User.findOne({
          where: {
            $or: [
              { username: req.body.username_or_email },
              { email: req.body.username_or_email }
            ]
          }
        }).then(user => {
          if (user) {
            bcrypt.compare(req.body.password, user.password_hash, function (
              err,
              same
            ) {
              if (err) {
                return apiResponse.errorResponse(res, err);
              }
              if (same) {
                if (user.is_active) {
                  let dataRes = {
                    user
                  };
                  const jwtPayload = {
                    id: user.id
                  };
                  const jwtData = {
                    expiresIn: parseInt(config.expiredTime) * 60
                  };
                  dataRes.token = jwt.sign(jwtPayload, config.secretKey, jwtData);

                  return apiResponse.successResponseWithData(
                    res,
                    "Login Success.",
                    dataRes
                  );
                } else {
                  return apiResponse.unauthorizedResponse(
                    res,
                    "Account is not active. Please contact admin."
                  );
                }
              } else {
                return apiResponse.validationErrorWithData(
                  res,
                  "Username, Email or Password wrong."
                );
              }
            });
          } else {
            return apiResponse.validationErrorWithData(
              res,
              "Username, Email or Password wrong."
            );
          }
        });
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
