import moment from "moment";

const FORMAT_DATE_ONLY = "DD-MM-YYYY";
const DATE_ONLY_REGEX = /^([0-2][0-9]|(3)[0-1])(\-)(((0)[0-9])|((1)[0-2]))(\-)\d{4}$/i;

const isValidDate = (date) => {
  if (DATE_ONLY_REGEX.test(date)) {
    const dateMoment = moment(date, FORMAT_DATE_ONLY);
    return dateMoment.isValid();
  }
  return false;
}

export default {
  isValidDate,
}