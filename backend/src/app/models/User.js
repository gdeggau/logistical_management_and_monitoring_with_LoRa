import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import generateUuid from '../utils/generateUuid';

class User extends Model {
  // o parametro sequelize é a conexão com o banco de dados
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        telephone: Sequelize.STRING,
        email: Sequelize.STRING,
        // VIRTUAL é um tipo de dado que nunca vai existir nada base
        // apena utilizado no código
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        role: Sequelize.STRING,
        full_name: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${this.name} ${this.last_name}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    generateUuid(this);

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsToMany(models.Adress, {
      foreignKey: 'user_id',
      through: models.UsersAdresses,
      as: 'adresses',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
