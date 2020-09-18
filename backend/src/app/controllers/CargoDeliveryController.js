import * as Yup from "yup";
import sequelizeInstance from "../../database/index";

import Vehicle from "../models/Vehicle";
import Cargo from "../models/Cargo";
import User from "../models/User";
import Order from "../models/Order";
import OrdersHistory from "../models/OrdersHistory";

import StatusCargo from "../utils/EnumStatusCargo";
import StatusOrder from "../utils/EnumStatusOrder";

import { Op } from "sequelize";

class CargoDeliveryController {
  async store(req, res) {
    let transaction;

    const schema = Yup.object().shape({
      id: Yup.string().required(),
      cargo_number: Yup.string().required(),
      orders: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required(),
          order_number: Yup.string().required(),
          other_infos: Yup.object().shape({
            scanned: Yup.bool().oneOf([true]).required(),
          }),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails!" });
    }

    console.log(req.body);

    try {
      transaction = await sequelizeInstance.connection.transaction();

      const cargo = await Cargo.findOne(
        {
          where: {
            id: req.body.id,
            cargo_number: req.body.cargo_number,
          },
        },
        { transaction }
      );

      if (!cargo) {
        return res.status(400).json({
          error: "No cargo was found in database with identifiers provided!",
        });
      }

      const ordersIds = [];
      req.body.orders.map((order) => {
        ordersIds.push(order.id);
      });

      const cargoOrders = await cargo.getOrders(
        {
          where: {
            id: {
              [Op.in]: ordersIds,
            },
          },
        },
        { transaction }
      );

      if (cargoOrders.length !== (await cargo.countOrders({ transaction }))) {
        return res.status(400).json({
          error: "There is one or more orders from this cargo missing scan!",
        });
      }

      await cargo.update(
        {
          status: StatusCargo.ONDELIVERY.value,
          observation: StatusCargo.ONDELIVERY.description,
        },
        { transaction }
      );

      await cargo.createCargosGeolocation(
        {
          status: StatusCargo.ONDELIVERY.value,
          observation: StatusCargo.ONDELIVERY.description,
        },
        { transaction }
      );
      //continuar aqui

      return res.json(cargoOrders);
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      return res.status(400).json({
        error:
          "An unexpected error occurred, please contact system administrator! ",
      });
    }
  }
}

export default new CargoDeliveryController();
