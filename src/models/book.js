import DataType from "sequelize";
import Model from "./sequelize";
import Category from "./category";
import Publisher from "./publisher";
import Author from "./author";
import BookImage from "./bookImage";
import { SALE_STATUS } from "../constants/product";

const Book = Model.define(
  "Book",
  {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataType.STRING,
      unique: true
    },
    short_name: {
      type: DataType.STRING,
      unique: true
    },
    url: {
      type: DataType.STRING,
      defaultValue: null
    },
    short_description: {
      type: DataType.TEXT,
      defaultValue: null
    },
    description: {
      type: DataType.TEXT,
      defaultValue: null
    },
    release_date: {
      type: DataType.DATE,
      defaultValue: null
    },
    number_of_pages: {
      type: DataType.INTEGER,
      defaultValue: null
    },
    weight: {
      type: DataType.INTEGER,
      defaultValue: null
    },
    size: {
      type: DataType.STRING,
      defaultValue: null
    },
    on_sale_date: {
      type: DataType.DATE,
      defaultValue: null
    },
    import_price: {
      type: DataType.DOUBLE,
      defaultValue: null
    },
    root_price: {
      type: DataType.DOUBLE,
      defaultValue: null
    },
    sale_price: {
      type: DataType.DOUBLE,
      defaultValue: null
    },
    quantity_in_stock: {
      type: DataType.INTEGER,
      defaultValue: null
    },
    demo: {
      type: DataType.STRING,
      defaultValue: null
    },
    url: {
      type: DataType.STRING,
      defaultValue: null
    },
    sale_status: {
      type: DataType.ENUM,
      values: Object.values(SALE_STATUS),
      defaultValue: null
    },
    is_active: {
      type: DataType.BOOLEAN,
      defaultValue: true
    },
    publisher_id: {
      type: DataType.INTEGER,
      defaultValue: null,
      allowNull: true
    }
  },
  {
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: false
  }
);

Book.hasMany(BookImage, {
  foreignKey: "book_id",
  as: "images",
  onDelete: "CASCADE",
});

Book.belongsToMany(Category, { through: "book_category", foreignKey: "book_id", as: "categories" });
Category.belongsToMany(Book, {
  through: "book_category",
  foreignKey: "category_id",
  as: "books"
});

Publisher.hasMany(Book, {
  foreignKey: "publisher_id",
  as: "books",
});
Book.belongsTo(Publisher, {
  foreignKey: "publisher_id",
  as: "publisher"
});

Book.belongsToMany(Author, { through: "book_author", foreignKey: "book_id", as: "authors" });
Author.belongsToMany(Book, { through: "book_author", foreignKey: "author_id", as: "books" });

export default Book;
