import DataType from "sequelize";
import Model from "./sequelize";

const Category = Model.define(
  "Category",
  {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parent_id: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    name: {
      type: DataType.STRING,
      unique: true
    },
    short_name: {
      type: DataType.STRING,
      unique: true
    },
    description: {
      type: DataType.TEXT,
      defaultValue: null
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

Category.hasMany(Category, {
  foreignKey: "parent_id",
  as: "children",
});
Category.belongsTo(Category, {
  foreignKey: "parent_id",
  as: "parent",
});

export default Category;
