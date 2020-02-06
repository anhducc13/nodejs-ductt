const successResponse = (res, msg) => {
  const data = {
    code: 0,
    message: msg,
    errors: null,
  };
  return res.status(200).json(data);
};

const successResponseWithData = (res, msg, data) => {
  const resData = {
    code: 0,
    message: msg,
    data: data,
    errors: null
  };
  return res.status(200).json(resData);
};

const errorResponse = (res, msg, code = 1) => {
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

const validationErrorWithData = (res, msg, data, code = 1) => {
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
