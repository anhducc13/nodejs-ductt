import DataType from "sequelize";
import Model from "./sequelize";
import Ward from "./wards";

const District = Model.define(
  "District",
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
    city_id: {
      type: DataType.STRING({ length: 5 }),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "districts"
  }
);

District.hasMany(Ward, {
  foreignKey: "district_id",
  as: "wards"
});
Ward.belongsTo(District, {
  foreignKey: "district_id",
  as: "district"
});

export default District;
