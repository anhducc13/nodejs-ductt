import DataType from "sequelize";
import Model from "./sequelize";

const Author = Model.define(
  "Author",
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
    description: {
      type: DataType.TEXT,
      defaultValue: null
    },
    rate: {
      type: DataType.INTEGER,
      defaultValue: 5
    },
    url: {
      type: DataType.STRING,
      defaultValue: null
    },
    is_active: {
      type: DataType.BOOLEAN,
      defaultValue: true
    }
  },
  {
    timestamps: false,
    // updatedAt: "updated_at",
    // createdAt: "created_at",
    // deletedAt: "deleted_at"
  }
);

export default Author;
