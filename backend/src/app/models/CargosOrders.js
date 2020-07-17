import Sequelize, { Model } from "sequelize";
import generateUuid from "../utils/generateUuid";

class CargosOrders extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        pending_scan: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: "cargos_orders",
      }
    );

    generateUuid(this);

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "employee_id", as: "employee" });
  }
}

export default CargosOrders;
