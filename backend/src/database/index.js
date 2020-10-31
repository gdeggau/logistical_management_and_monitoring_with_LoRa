import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Device from '../app/models/Device';
import Vehicle from '../app/models/Vehicle';
import Adress from '../app/models/Adress';
import UsersAdresses from '../app/models/UsersAdresses';
import Product from '../app/models/Product';
import Order from '../app/models/Order';
import Cargo from '../app/models/Cargo';
import VehiclesGeolocation from '../app/models/VehiclesGeolocation';
import CargosOrders from '../app/models/CargosOrders';
import OrdersHistory from '../app/models/OrdersHistory';

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
  VehiclesGeolocation,
  CargosOrders,
  OrdersHistory,
];

class Database {
  constructor() {
    this.init();
    this.mongo();
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

  mongo() {
    this.mongoConnection = mongoose.connect('mongodb://localhost:27017/tcc', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
