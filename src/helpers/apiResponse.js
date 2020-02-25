const successResponse = (res, msg) => {
  const data = {
    code: "SUCCESS",
    message: msg,
    errors: null,
  };
  return res.status(200).json(data);
};

const successResponseWithData = (res, msg, data) => {
  const resData = {
    code: "SUCCESS",
    message: msg,
    data: data,
    errors: null
  };
  return res.status(200).json(resData);
};

const errorResponse = (res, msg, code = "UNKNOWN_ERROR") => {
  const data = {
    code: code,
    message: msg,
    data: null,
    errors: null,
  };
  return res.status(500).json(data);
};

const notFoundResponse = (res, msg, code = "NOT_FOUND") => {
  const data = {
    code: code,
    message: msg,
    errors: null,
  };
  return res.status(404).json(data);
};

const validationErrorWithData = (res, msg, data, code = "BAD_REQUEST") => {
  const resData = {
    code: code,
    message: msg,
    errors: data
  };
  return res.status(400).json(resData);
};

const unauthorizedResponse = (res, msg, code = "UNAUTHORIZED") => {
  const data = {
    code: code,
    message: msg,
    errors: null,
  };
  return res.status(401).json(data);
};

export default {
  successResponse,
  successResponseWithData,
  errorResponse,
  notFoundResponse,
  validationErrorWithData,
  unauthorizedResponse
};
