import { body, validationResult, sanitizeBody } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import { apiResponse } from "../../helpers";

export default [
  body("username")
    .notEmpty()
    .withMessage("Field required")
    .isLength({ min: 8, max: 255 })
    .trim()
    .withMessage("Username must be specified.")
    .custom(value => {
      return User.findOne({ where: { username: value } }).then(user => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    }),
  body("email")
    .notEmpty()
    .withMessage("Field required")
    .isLength({ min: 8, max: 255 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom(value => {
      return User.findOne({ where: { email: value } }).then(user => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  body("password")
    .notEmpty()
    .withMessage("Field required")
    .isLength({ min: 8, max: 255 })
    .trim()
    .withMessage("Password must be 8 characters or greater."),
  sanitizeBody("username").escape(),
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error",
          errors.array().map(e => e.msg)
        );
      } else {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          console.log(req.body.username);
          User.create({
            username: req.body.username,
            email: req.body.email,
            password_hash: hash
          })
            .then(user => {
              return apiResponse.successResponseWithData(
                res,
                "Registration Success.",
                user
              );
            })
            .catch(err => {
              console.log(err);
              return apiResponse.errorResponse(res, err);
            });
        });
      }
    } catch (err) {
      console.log(err);
      return apiResponse.errorResponse(res, err);
    }
  }
];
