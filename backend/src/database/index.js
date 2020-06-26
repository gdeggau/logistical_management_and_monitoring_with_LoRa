import Sequelize from "sequelize";
import User from "../app/models/User";
import File from "../app/models/File";
import Device from "../app/models/Device";
import Vehicle from "../app/models/Vehicle";
import databaseConfig from "../config/database";
import Adress from "../app/models/Adress";
import UsersAdresses from "../app/models/UsersAdresses";
import Product from "../app/models/Product";
import Order from "../app/models/Order";

const models = [
  User,
  File,
  Device,
  Vehicle,
  Adress,
  UsersAdresses,
  Product,
  Order,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
