import DataType from "sequelize";
import Model from "./sequelize";

const Publisher = Model.define(
  "Publisher",
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
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: false
  }
);

export default Publisher;
