import Sequelize, { Model } from 'sequelize';
import generateUuid from '../utils/generateUuid';

class OrdersHistory extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        status: Sequelize.STRING,
        observation: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'orders_history',
      }
    );

    generateUuid(this);
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  }
}

export default OrdersHistory;
