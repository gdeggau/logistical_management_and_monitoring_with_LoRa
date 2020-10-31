import Sequelize, { Model } from 'sequelize';

import generateUuid from '../utils/generateUuid';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        price: Sequelize.FLOAT,
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
    this.belongsTo(models.File, { foreignKey: 'image_id' });
  }
}

export default Product;
