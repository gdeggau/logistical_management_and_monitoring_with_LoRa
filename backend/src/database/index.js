import Sequelize from "sequelize";
import cls from "cls-hooked";
import databaseConfig from "../config/database";

import User from "../app/models/User";
import File from "../app/models/File";
import Device from "../app/models/Device";
import Vehicle from "../app/models/Vehicle";
import Adress from "../app/models/Adress";
import UsersAdresses from "../app/models/UsersAdresses";
import Product from "../app/models/Product";
import Order from "../app/models/Order";
import Cargo from "../app/models/Cargo";
import CargosGeolocation from "../app/models/CargosGeolocation";
import CargosOrders from "../app/models/CargosOrders";
import OrdersHistory from "../app/models/OrdersHistory";

const models = [
  User,
  File,
  Device,
  Vehicle,
  Adress,
  UsersAdresses,
  Product,
  Order,
  Cargo,
  CargosGeolocation,
  CargosOrders,
  OrdersHistory,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // const namespace = cls.createNamespace("my-very-own-namespace");
    // Sequelize.useCLS(namespace);
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
