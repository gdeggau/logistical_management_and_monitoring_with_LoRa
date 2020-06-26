import Sequelize, { Model } from "sequelize";

import generateUuid from "../utils/generateUuid";

class Vehicle extends Model {
  static init(sequelize) {
    super.init(
      {
        license_plate: Sequelize.STRING,
        model: Sequelize.STRING,
        brand: Sequelize.STRING,
        reference: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    generateUuid(this);

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Device, { foreignKey: "device_id", as: "device" });
  }
}

export default Vehicle;
