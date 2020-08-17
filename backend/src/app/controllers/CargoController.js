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

import { startOfHour, parseISO, isBefore } from "date-fns";

class CargoController {
  async store(req, res) {
    let transaction;

    const schema = Yup.object().shape({
      plan_delivery_date_leave: Yup.date().required(),
      plan_delivery_date_return: Yup.date().required(),
      driver_id: Yup.string().required(),
      vehicle_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails!" });
    }

    const checkIsEmployee = await User.findOne({
      where: { id: req.userId, employee: true },
    });
    if (!checkIsEmployee) {
      return res
        .status(400)
        .json({ error: "Just employees can create a cargo!" });
    }

    const checkDriverIsEmployee = await User.findOne({
      where: { id: req.body.driver_id, employee: true },
    });
    if (!checkDriverIsEmployee) {
      return res.status(400).json({ error: "Driver must be an employee!" });
    }

    const checkVehicleHasDevice = await Vehicle.findOne({
      where: { id: req.body.vehicle_id, device_id: { [Op.not]: null } },
    });

    if (!checkVehicleHasDevice) {
      return res
        .status(400)
        .json({ error: "Vehicle must have a device associated!" });
    }

    const planDeliveryDateLeave = parseISO(req.body.plan_delivery_date_leave);
    if (isBefore(planDeliveryDateLeave, new Date())) {
      return res.status(400).json({ error: "Past dates are not permited!" });
    }

    const planDeliveryDateReturn = parseISO(req.body.plan_delivery_date_return);
    if (
      isBefore(planDeliveryDateReturn, new Date()) ||
      isBefore(planDeliveryDateReturn, planDeliveryDateLeave)
    ) {
      return res
        .status(400)
        .json({ error: "Return date must be after leave date!" });
    }

    try {
      transaction = await sequelizeInstance.connection.transaction();
      const checkAvailabilityDriverOrVehicle = await Cargo.findOne(
        {
          where: {
            [Op.or]: [
              {
                driver_id: req.body.driver_id,
              },
              {
                vehicle_id: req.body.vehicle_id,
              },
            ],

            [Op.or]: [
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        plan_delivery_date_leave: {
                          [Op.lt]: req.body.plan_delivery_date_leave,
                        },
                      },
                      {
                        plan_delivery_date_return: {
                          [Op.gt]: req.body.plan_delivery_date_leave,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        plan_delivery_date_leave: {
                          [Op.lt]: req.body.plan_delivery_date_return,
                        },
                      },
                      {
                        plan_delivery_date_return: {
                          [Op.gt]: req.body.plan_delivery_date_return,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                [Op.and]: [
                  {
                    plan_delivery_date_leave: {
                      [Op.between]: [
                        req.body.plan_delivery_date_leave,
                        req.body.plan_delivery_date_return,
                      ],
                    },
                  },
                  {
                    plan_delivery_date_return: {
                      [Op.between]: [
                        req.body.plan_delivery_date_leave,
                        req.body.plan_delivery_date_return,
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
        { transaction }
      );

      if (checkAvailabilityDriverOrVehicle) {
        return res.status(400).json({
          error:
            "Driver or vehicle is already planned to do a delivery in that date.",
        });
      }

      const cargo = await Cargo.create(
        {
          plan_delivery_date_leave: req.body.plan_delivery_date_leave,
          plan_delivery_date_return: req.body.plan_delivery_date_return,
          driver_id: req.body.driver_id,
          vehicle_id: req.body.vehicle_id,
          status: StatusCargo.EMPTY.value,
          observation: StatusCargo.EMPTY.description,
        },
        { transaction }
      );

      await cargo.createCargosGeolocation(
        {
          status: StatusCargo.EMPTY.value,
          observation: StatusCargo.EMPTY.description,
          transaction,
        },
        { transaction }
      );

      const ordersIdsFromReq = req.body.orders;
      if (!ordersIdsFromReq || ordersIdsFromReq.length == 0) {
        await transaction.commit();
        const cargoCreated = await Cargo.findByPk(cargo.id, {
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
              attributes: ["id", "name", "last_name", "telephone", "email"],
            },
            {
              association: "vehicle",
              attributes: [
                "id",
                "license_plate",
                "model",
                "brand",
                "reference",
              ],
              include: [
                {
                  association: "device",
                  attributes: ["id", "name", "device_identifier"],
                },
              ],
            },
          ],
        });
        return res.json(cargoCreated);
      }

      const ordersIds = [];
      ordersIdsFromReq.map((order) => {
        ordersIds.push(order.order_id);
      });

      const ordersFromDB = await Order.findAll(
        {
          where: {
            id: {
              [Op.in]: ordersIds,
            },
            [Op.or]: [
              {
                status: StatusOrder.PENDING.value,
              },
              {
                status: StatusOrder.RETURNED.value,
              },
            ],
          },
        },
        { transaction }
      );

      console.log(ordersIds.length);
      console.log(ordersFromDB.length);
      if (ordersFromDB.length != ordersIds.length) {
        return res.status(400).json({
          error:
            "There is one or more order already in a cargo, review your choices.",
        });
      }

      await cargo.addOrders(ordersFromDB, {
        as: "order_id",
        through: { employee_id: req.userId, pending_scan: true },
        transaction,
      });

      // await ordersFromDB[0].createOrdersHistory({
      //   status: StatusOrder.ONCARGO.value,
      //   observation: StatusOrder.ONCARGO.description,
      //   transaction,
      // });

      const promises = [];
      for await (const orderToBeInsertHistory of ordersFromDB) {
        const orderHist = await orderToBeInsertHistory.createOrdersHistory(
          {
            status: StatusOrder.ONCARGO.value,
            observation: StatusOrder.ONCARGO.description,
          },
          { transaction }
        );

        promises.push(orderHist);
      }

      Promise.all(promises);

      await Order.update(
        {
          status: StatusOrder.ONCARGO.value,
          observation: StatusOrder.ONCARGO.description,
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

      await cargo.createCargosGeolocation(
        {
          status: StatusCargo.CLOSED.value,
          observation: StatusCargo.CLOSED.description,
          transaction,
        },
        { transaction }
      );

      await transaction.commit();

      const cargoOrders = await Cargo.findByPk(cargo.id, {
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
            attributes: ["id", "name", "last_name", "telephone", "email"],
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
            association: "orders",
            attributes: [
              "id",
              "order_number",
              "quantity",
              "freight",
              "total_price",
              "status",
            ],
            through: {
              attributes: ["pending_scan", "employee_id"],
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
                ],
              },
            ],
          },
        ],
      });
      return res.json(cargoOrders);
    } catch (err) {
      console.log(err);
      if (transaction) await transaction.rollback();
      return res.status(400).json({
        error:
          "An unexpected error occurred, please contact system administrator! ",
      });
    }
  }
}

export default new CargoController();
