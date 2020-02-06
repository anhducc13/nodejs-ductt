import slugify from "slugify";

const generateUrl = (text) => {
  return slugify(text, { lower: true })
}

export default {
  generateUrl,
}