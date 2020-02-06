import sequelize from "./sequelize";
import User from "./user";
import Author from "./author";
import Publisher from "./publisher";
import Category from "./category";
import Book from "./book";
import BookImage from "./bookImage";

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, Author, Publisher, Category, Book, BookImage };
