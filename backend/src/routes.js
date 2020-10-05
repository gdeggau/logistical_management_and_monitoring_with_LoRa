import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import EmployeeController from "./app/controllers/EmployeeController";
import DeviceController from "./app/controllers/DeviceController";
import VehicleController from "./app/controllers/VehicleController";
import AdressController from "./app/controllers/AdressController";
import UserAdressesController from "./app/controllers/UsersAdressesController";
import ProductController from "./app/controllers/ProductController";
import CargoController from "./app/controllers/CargoController";
import CargoDeliveryController from "./app/controllers/CargoDeliveryController";
import UserOrderController from "./app/controllers/UserOrderController";
import OrderController from "./app/controllers/OrderController";

import authMiddleware from "./app/middlewares/auth";
import admin from "./app/middlewares/admin";
import DriverController from "./app/controllers/DriverController";

// import STATUS from "./app/utils/EnumStatusCargo";
// import UserAdr from "./app/models/UsersAdresses";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use("/teste", async (req, res, next) => {
  console.log("Params:", req.params);
  console.log("Request URL:", req.originalUrl);
  console.log("Request Type:", req.method);
  //   console.log("Requisição completa:", req);
  console.log("Corpo da requisição:", req.body);
  console.log("recebeu");
  //   next();
  return res.json({ message: "foi" });
});

//para todas as rotas abaixo será necessário ter o token no header da req.
routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.get("/employees", EmployeeController.index);
routes.get("/orders/user", UserOrderController.index);

routes.get("/adresses/user", UserAdressesController.index);
routes.get("/products", ProductController.index);

routes.post("/adresses/user", UserAdressesController.store);
routes.post("/products", ProductController.store);
routes.post("/orders/user", UserOrderController.store);

routes.post("/files", upload.single("file"), FileController.store);

routes.use(admin);
routes.post("/cargos", CargoController.store);
routes.post("/cargos/delivery", CargoDeliveryController.store);
routes.post("/devices", DeviceController.store);
routes.post("/vehicles", VehicleController.store);

routes.get("/cargos", CargoController.index);
routes.get("/cargos/delivery", CargoDeliveryController.index);
routes.get("/orders", OrderController.index);
routes.get("/vehicles", VehicleController.index);
routes.get("/drivers", DriverController.index);
routes.get("/devices", DeviceController.index);
export default routes;
