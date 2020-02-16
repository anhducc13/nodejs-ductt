import DataType from "sequelize";
import Model from "./sequelize";
import District from "./districts";

const City = Model.define(
  "City",
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
    }
  },
  {
    timestamps: false,
    tableName: "cities"
  }
);

City.hasMany(District, {
  foreignKey: "city_id",
  as: "districts"
});
District.belongsTo(City, {
  foreignKey: "city_id",
  as: "city"
});

export default City;
