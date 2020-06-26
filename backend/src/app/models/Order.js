import Sequelize, { Model } from "sequelize";
import moment from "moment";

import generateUuid from "../utils/generateUuid";

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        order_number: Sequelize.STRING,
        quantity: Sequelize.INTEGER,
        freight: Sequelize.FLOAT,
        total_price: Sequelize.FLOAT,
        status: Sequelize.STRING,
        observation: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    generateUuid(this);
    this.addHook("beforeCreate", async (order) => {
      order.order_number = moment().valueOf().toString();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
    this.belongsTo(models.Adress, {
      foreignKey: "delivery_adress_id",
      as: "delivery_adress",
    });
  }
}

export default Order;
