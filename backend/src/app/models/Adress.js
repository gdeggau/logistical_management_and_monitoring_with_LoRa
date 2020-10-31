import Sequelize, { Model } from 'sequelize';
import generateUuid from '../utils/generateUuid';

class Adress extends Model {
  static init(sequelize) {
    super.init(
      {
        cep: Sequelize.STRING,
        address: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        district: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        latitude: Sequelize.DECIMAL(9, 6),
        longitude: Sequelize.DECIMAL(9, 6),
        relevance: Sequelize.FLOAT,
      },
      {
        sequelize,
        tableName: 'adresses',
      }
    );

    generateUuid(this);

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      foreignKey: 'adress_id',
      through: models.UsersAdresses,
      as: 'users',
    });
  }
}

export default Adress;
