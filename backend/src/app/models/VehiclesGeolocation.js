import Sequelize, { Model } from 'sequelize';
import generateUuid from '../utils/generateUuid';

class VehiclesGeolocation extends Model {
  static init(sequelize) {
    super.init(
      {
        status: Sequelize.STRING,
        observation: Sequelize.STRING,
        latitude: Sequelize.DECIMAL(9, 6),
        longitude: Sequelize.DECIMAL(9, 6),
      },
      {
        sequelize,
      }
    );

    generateUuid(this);

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
    this.belongsTo(models.Cargo, { foreignKey: 'cargo_id', as: 'cargo' });
  }
}

export default VehiclesGeolocation;
