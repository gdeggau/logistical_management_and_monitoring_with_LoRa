import Sequelize, { Model } from "sequelize";

import generateUuid from "../utils/generateUuid";
import generateSequencialCargoNumber from "../utils/generateSequencialCargoNumber";

class Cargo extends Model {
  static init(sequelize) {
    super.init(
      {
        cargo_number: Sequelize.STRING,
        plan_delivery_date_leave: Sequelize.DATE,
        plan_delivery_date_return: Sequelize.DATE,
        delivery_date_leave: Sequelize.DATE,
        delivery_date_return: Sequelize.DATE,
        status: Sequelize.STRING,
        observation: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    generateUuid(this);
    this.addHook("beforeCreate", async (cargo) => {
      const cargo_number = await generateSequencialCargoNumber(cargo, this);
      cargo.cargo_number = cargo_number;
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Vehicle, { foreignKey: "vehicle_id", as: "vehicle" });
    this.belongsTo(models.User, { foreignKey: "driver_id", as: "driver" });
    this.belongsToMany(models.Order, {
      foreignKey: "cargo_id",
      through: models.CargosOrders,
      as: "orders",
    });
    this.hasMany(models.CargosGeolocation, {
      foreignKey: "cargo_id",
      as: "geolocations",
    });
  }
}

export default Cargo;
