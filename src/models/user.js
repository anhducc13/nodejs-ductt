import DataType from "sequelize";
import Model from "./sequelize";

const User = Model.define(
  "User",
  {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataType.STRING,
      unique: true
    },
    password_hash: {
      type: DataType.STRING,
      allowNull: true
    },
    email: {
      type: DataType.STRING,
      unique: true
    },
    fullname: {
      type: DataType.STRING,
      defaultValue: null
    },
    gender: {
      type: DataType.BOOLEAN,
      defaultValue: null
    },
    is_active: {
      type: DataType.BOOLEAN,
      defaultValue: true
    },
    is_admin: {
      type: DataType.BOOLEAN,
      defaultValue: false
    },
    avatar: {
      type: DataType.STRING,
      defaultValue: null
    },
    dob: {
      type: DataType.DATE,
      defaultValue: null
    },
    phone_number: {
      type: DataType.STRING,
      defaultValue: null
    },
  },
  {
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: false
  }
);

export default User;
