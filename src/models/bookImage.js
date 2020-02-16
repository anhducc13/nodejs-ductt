import DataType from "sequelize";
import Model from "./sequelize";

const BookImage = Model.define(
  "BookImage",
  {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    book_id: {
      type: DataType.INTEGER,
      allowNull: false
    },
    url: {
      type: DataType.STRING
    }
  },
  {
    tableName: "book_images",
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: false
  }
);

export default BookImage;
