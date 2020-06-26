import Sequelize, { Model } from "sequelize";
import generateUuid from "../utils/generateUuid";

class UsersAdresses extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        main_adress: Sequelize.BOOLEAN,
        delivery_adress: Sequelize.BOOLEAN,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: "users_adresses",
      }
    );

    generateUuid(this);

    return this;
  }
}

export default UsersAdresses;
