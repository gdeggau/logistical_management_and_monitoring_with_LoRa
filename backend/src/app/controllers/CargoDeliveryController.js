import * as Yup from "yup";
import sequelizeInstance from "../../database/index";

import Vehicle from "../models/Vehicle";
import Cargo from "../models/Cargo";
import User from "../models/User";
import Order from "../models/Order";
import CargosOrders from "../models/CargosOrders";
import OrdersHistory from "../models/OrdersHistory";

import StatusCargo from "../utils/EnumStatusCargo";
import StatusOrder from "../utils/EnumStatusOrder";

import { Op } from "sequelize";
import CargosGeolocation from "../models/CargosGeolocation";

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
        await transaction.rollback();
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
        await transaction.rollback();
        return res.status(400).json({
          error: "There is one or more orders from this cargo missing scan!",
        });
      }

      await cargo.update(
        {
          status: StatusCargo.ONDELIVERY.value,
          observation: StatusCargo.ONDELIVERY.description,
          delivery_date_leave: new Date(),
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

      await Order.update(
        {
          status: StatusOrder.ONDELIVERY.value,
          observation: StatusOrder.ONDELIVERY.description,
        },
        {
          where: {
            id: {
              [Op.in]: ordersIds,
            },
          },
          transaction,
        }
      );

      const promises = [];
      for await (const orderToBeInsertHistory of cargoOrders) {
        const orderHist = await orderToBeInsertHistory.createOrdersHistory(
          {
            status: StatusOrder.ONDELIVERY.value,
            observation: StatusOrder.ONDELIVERY.description,
          },
          { transaction }
        );

        promises.push(orderHist);
      }
      Promise.all(promises);

      await CargosOrders.update(
        {
          employee_id: req.userId,
          scanned: true,
        },
        {
          where: {
            cargo_id: cargo.id,
          },
          transaction,
        }
      );

      await transaction.commit();

      const cargoResult = await Cargo.findByPk(cargo.id, {
        attributes: [
          "id",
          "cargo_number",
          "plan_delivery_date_leave",
          "plan_delivery_date_return",
          "status",
          "observation",
          "createdAt",
        ],
        include: [
          {
            association: "driver",
            attributes: [
              "id",
              "name",
              "last_name",
              "telephone",
              "email",
              "full_name",
            ],
          },
          {
            association: "vehicle",
            attributes: ["id", "license_plate", "model", "brand", "reference"],
            include: [
              {
                association: "device",
                attributes: ["id", "name", "device_identifier"],
              },
            ],
          },
          {
            association: "geolocations",
            attributes: ["latitude", "longitude", "created_at"],
            order: [["created_at", "DESC"]],
          },
          {
            association: "orders",
            attributes: [
              "id",
              "order_number",
              "quantity",
              "freight",
              "total_price",
              "status",
              "observation",
            ],
            through: {
              attributes: ["scanned", "employee_id"],
              as: "other_infos",
            },
            include: [
              {
                association: "product",
                attributes: ["id", "name", "description"],
              },
              {
                association: "user",
                attributes: ["id", "name", "last_name", "telephone", "email"],
              },
              {
                association: "delivery_adress",
                attributes: [
                  "id",
                  "cep",
                  "address",
                  "number",
                  "complement",
                  "district",
                  "city",
                  "state",
                  "latitude",
                  "longitude",
                  "relevance",
                ],
              },
            ],
          },
        ],
      });

      return res.json(cargoResult);
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      return res.status(400).json({
        error:
          "An unexpected error occurred, please contact system administrator! ",
      });
    }
  }

  async index(req, res) {
    const cargos = await Cargo.findAll({
      where: { status: StatusCargo.ONDELIVERY.value },
      attributes: [
        "id",
        "cargo_number",
        "plan_delivery_date_return",
        "delivery_date_leave",
        "delivery_date_return",
        "status",
        "observation",
        "createdAt",
      ],
      include: [
        {
          model: User,
          as: "driver",
          attributes: ["name", "last_name", "telephone", "email", "full_name"],
        },
        {
          model: Vehicle,
          as: "vehicle",
          attributes: [
            "id",
            "barcode_scan",
            "license_plate",
            "model",
            "brand",
            "reference",
          ],
          include: [
            {
              association: "device",
              attributes: ["name", "device_identifier"],
            },
          ],
        },
        {
          model: CargosGeolocation,
          as: "geolocations",
          attributes: ["latitude", "longitude", "created_at"],
          order: [["created_at", "DESC"]],
          where: {
            status: StatusCargo.ONDELIVERY.value,
          },
        },
        {
          model: Order,
          as: "orders",
          attributes: [
            "id",
            "order_number",
            "barcode_scan",
            "quantity",
            "freight",
            "total_price",
            "status",
          ],
          through: {
            attributes: ["scanned", "employee_id"],
            as: "other_infos",
          },
          include: [
            {
              association: "product",
              attributes: ["id", "name", "description"],
            },
            {
              association: "user",
              attributes: ["id", "name", "last_name", "telephone", "email"],
            },
            {
              association: "delivery_adress",
              attributes: [
                "id",
                "cep",
                "address",
                "number",
                "complement",
                "district",
                "city",
                "state",
                "latitude",
                "longitude",
                "relevance",
              ],
            },
          ],
        },
      ],
    });
    return res.json(cargos);
  }
}

export default new CargoDeliveryController();
