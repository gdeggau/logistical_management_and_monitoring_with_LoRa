import Sequelize, { Model } from 'sequelize';
import generateUuid from '../utils/generateUuid';

class Device extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        device_identifier: Sequelize.STRING,
        label: Sequelize.STRING,
        description: Sequelize.STRING,
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
    this.hasMany(models.Vehicle, { foreignKey: 'device_id', as: 'vehicles' });
  }
}

export default Device;
