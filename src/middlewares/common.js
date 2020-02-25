import { apiResponse, validateHelpers } from "../helpers";

export const validateString = (name, position, options) => {
  const newOption = {
    required: false,
    trim: true,
    minLength: 1,
    maxLength: 255,
    ...options,
  }
  return (req, res, next) => {
    let data = req[position][name];
    if (data === undefined || data === null) {
      if (newOption.required) {
        return apiResponse.validationErrorWithData(res, `${name} in ${position} must be required`, null);
      }
      return next();
    }
    if (!(typeof data === "string")) {
      return apiResponse.validationErrorWithData(res, `${name} in ${position} must be a string`, null);
    }
    if (newOption.trim) {
      data = data.trim();
    }
    if (data.length < newOption.minLength || data.length > newOption.maxLength) {
      return apiResponse.validationErrorWithData(res, `${name} in ${position} must a length from ${newOption.minLength} to ${newOption.maxLength}`, null);
    }
    if (newOption.regex) {
      if (!newOption.regex.test(data)) {
        return apiResponse.validationErrorWithData(res, `${name} in ${position} must match regex ${newOption.regex.toString()}`);
      }
    }
    return next();
  }
}

export const validateNumber = (name, position, options) => {
  const newOption = {
    required: false,
    ...options,
  }
  return (req, res, next) => {
    let data = req[position][name];
    if (data === undefined || data === null) {
      if (newOption.required) {
        return apiResponse.validationErrorWithData(res, `${name} in ${position} must be required`, null);
      }
      return next();
    }
    try {
      data = Number(data);
      if (newOption.min && data < newOption.min) {
        return apiResponse.validationErrorWithData(res, `${name} in ${position} must be greater or equal than ${newOption.min}`, null);
      }
      if (newOption.max || data > newOption.max) {
        return apiResponse.validationErrorWithData(res, `${name} in ${position} must be less or equal than ${newOption.max}`, null);
      }
      return next();
    } catch {
      return apiResponse.validationErrorWithData(res, `${name} in ${position} must be a number`, null);
    }

  }
}

export const validateIncludes = (name, position, incls, options) => {
  const newOption = {
    required: false,
    ...options,
  }
  return (req, res, next) => {
    let data = req[position][name];
    if (data === undefined || data === null) {
      if (newOption.required) {
        return apiResponse.validationErrorWithData(res, `${name} in ${position} must be required`, null);
      }
      return next();
    }
    if (!(incls.includes(data))) {
      return apiResponse.validationErrorWithData(res, `${name} in ${position} must be one of in [${incls.join(",")}]`, null);
    }
    return next();
  }
}

export const validateDate = (name, position, options) => {
  const newOption = {
    required: false,
    ...options,
  }
  return (req, res, next) => {
    let data = req[position][name];
    if (data === undefined || data === null) {
      if (newOption.required) {
        return apiResponse.validationErrorWithData(res, `${name} in ${position} must be required`, null);
      }
      return next();
    }
    if (!(typeof data === "string")) {
      return apiResponse.validationErrorWithData(res, `${name} in ${position} must be a date string`, null);
    }
    if (!validateHelpers.isValidDate(data)) {
      return apiResponse.validationErrorWithData(res, `${name} in ${position} must be a date string format DD-MM-YYYY`, null);
    }
    return next();
  }
}

