import moment from "moment";
import Ajv from "ajv";

const FORMAT_DATE_ONLY = "DD-MM-YYYY";
const DATE_ONLY_REGEX = /^([0-2][0-9]|(3)[0-1])(\-)(((0)[0-9])|((1)[0-2]))(\-)\d{4}$/i;

const schemaInfo = {
  "type": "object",
  "properties": {
    "fullname": { "type": "string", "required": true },
    "email": { "type": "string", "required": true },
    "phone_number": { "type": "string", "pattern": "^[0-9()\\-\\.\\s]+$", "required": true },
    "address": { "type": "string", "required": true },
    "city_id": { "type": "string", "required": true },
    "district_id": { "type": "string", "required": true },
    "ward_id": { "type": "string", "required": true },
  }
}

const isValidDate = (date) => {
  if (DATE_ONLY_REGEX.test(date)) {
    const dateMoment = moment(date, FORMAT_DATE_ONLY);
    return dateMoment.isValid();
  }
  return false;
}

const isValidInfo = (info) => {
  const fields = ["fullname", "email", "phone_number", "address", "city_id", "district_id", "ward_id"];
  try {
    const valid = !!(JSON.stringify(fields) === JSON.stringify(Object.keys(info)));
    return valid;
  } catch {
    return false;
  }
}

export default {
  isValidDate,
  isValidInfo,
}