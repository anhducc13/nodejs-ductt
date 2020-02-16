import DataType from "sequelize";
import Model from "./sequelize";

const Ward = Model.define(
  "Ward",
  {
    id: {
      type: DataType.STRING({ length: 5 }),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataType.STRING({ length: 100 }),
      allowNull: false
    },
    type: {
      type: DataType.STRING({ length: 30 }),
      allowNull: false
    },
    district_id: {
      type: DataType.STRING({ length: 5 }),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "wards"
  }
);

export default Ward;
