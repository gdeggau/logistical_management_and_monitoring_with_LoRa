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

import authMiddleware from "./app/middlewares/auth";
import UserOrderController from "./app/controllers/UserOrderController";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

//para todas as rotas abaixo será necessário ter o token no header da req.
routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.get("/employees", EmployeeController.index);
routes.get("/orders", UserOrderController.index);

routes.post("/devices", DeviceController.store);
routes.post("/vehicles", VehicleController.store);
routes.post("/usersAdresses", UserAdressesController.store);
routes.post("/products", ProductController.store);
routes.post("/orders", UserOrderController.store);
routes.post("/files", upload.single("file"), FileController.store);

export default routes;
