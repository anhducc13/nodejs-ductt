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
    timestamps: false,
    // updatedAt: "updated_at",
    // createdAt: "created_at",
    // deletedAt: "deleted_at"
  }
);

export default BookImage;
