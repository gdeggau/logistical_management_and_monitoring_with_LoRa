/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, isBefore } from 'date-fns';
import sequelizeInstance from '../../database/index';

import Vehicle from '../models/Vehicle';
import Cargo from '../models/Cargo';
import User from '../models/User';
import Order from '../models/Order';
// import VehiclesGeolocation from '../models/VehiclesGeolocation';
import OrdersHistory from '../models/OrdersHistory';

import StatusCargo from '../utils/EnumStatusCargo';
import StatusOrder from '../utils/EnumStatusOrder';

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
      return res.status(400).json({ error: 'Validation fails!' });
    }

    // const checkIsEmployee = await User.findOne({
    //   where: { id: req.userId, employee: true },
    // });
    // if (!checkIsEmployee) {
    //   return res
    //     .status(400)
    //     .json({ error: "Just employees can create a cargo!" });
    // }

    const checkDriverIsEmployee = await User.findOne({
      where: { id: req.body.driver_id, role: 'DRIVER' },
    });
    if (!checkDriverIsEmployee) {
      return res.status(400).json({ error: 'User must be a driver!' });
    }

    const checkVehicleHasDevice = await Vehicle.findOne({
      where: { id: req.body.vehicle_id, device_id: { [Op.not]: null } },
    });

    if (!checkVehicleHasDevice) {
      return res
        .status(400)
        .json({ error: 'Vehicle must have a device associated!' });
    }

    const planDeliveryDateLeave = parseISO(req.body.plan_delivery_date_leave);
    if (isBefore(planDeliveryDateLeave, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited!' });
    }

    const planDeliveryDateReturn = parseISO(req.body.plan_delivery_date_return);
    if (
      isBefore(planDeliveryDateReturn, new Date()) ||
      isBefore(planDeliveryDateReturn, planDeliveryDateLeave)
    ) {
      return res
        .status(400)
        .json({ error: 'Return date must be after leave date!' });
    }

    try {
      transaction = await sequelizeInstance.connection.transaction();
      const checkAvailabilityDriverOrVehicle = await Cargo.findOne(
        {
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    driver_id: req.body.driver_id,
                  },
                  {
                    vehicle_id: req.body.vehicle_id,
                  },
                ],
              },
              {
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
            ],
          },
        },
        { transaction }
      );

      if (checkAvailabilityDriverOrVehicle) {
        await transaction.rollback();
        return res.status(400).json({
          error:
            'Driver or vehicle is already planned to do a delivery in that date.',
        });
      }

      // const checkDriverOrVehicleIsOnDelivery = await Cargo.findOne(
      //   {
      //     where: {
      //       [Op.and]: [
      //         {
      //           [Op.or]: [
      //             {
      //               driver_id: req.body.driver_id,
      //             },
      //             {
      //               vehicle_id: req.body.vehicle_id,
      //             },
      //           ],
      //         },
      //         {
      //           status: StatusCargo.ONDELIVERY.value,
      //         },
      //       ],
      //     },
      //   },
      //   { transaction }
      // );

      // if (checkDriverOrVehicleIsOnDelivery) {
      //   await transaction.rollback();
      //   return res.status(400).json({
      //     error: 'Driver or vehicle is on delivery!',
      //   });
      //   // return res.json(checkAvailabilityDriverOrVehicle);
      // }

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

      // await cargo.createCargosGeolocation(
      //   {
      //     status: StatusCargo.EMPTY.value,
      //     observation: StatusCargo.EMPTY.description,
      //     transaction,
      //   },
      //   { transaction }
      // );

      // await VehiclesGeolocation.create(
      //   {
      //     vehicle_id: checkVehicleHasDevice.id,
      //     cargo_id: cargo.id,
      //     status: StatusCargo.EMPTY.value,
      //     observation: StatusCargo.EMPTY.description,
      //   },
      //   { transaction }
      // );

      // await checkVehicleHasDevice.createVehiclesGeolocation(
      //   {
      //     cargo_id: cargo.id,
      //     status: StatusCargo.EMPTY.value,
      //     observation: StatusCargo.EMPTY.description,
      //   },
      //   { transaction }
      // );

      const ordersIdsFromReq = req.body.orders;
      if (!ordersIdsFromReq || ordersIdsFromReq.length === 0) {
        await transaction.commit();
        const cargoCreated = await Cargo.findByPk(cargo.id, {
          attributes: [
            'id',
            'cargo_number',
            'plan_delivery_date_leave',
            'plan_delivery_date_return',
            'status',
            'observation',
            'createdAt',
          ],
          include: [
            {
              association: 'driver',
              attributes: ['id', 'name', 'last_name', 'telephone', 'email'],
            },
            {
              association: 'vehicle',
              attributes: [
                'id',
                'license_plate',
                'model',
                'brand',
                'reference',
              ],
              include: [
                {
                  association: 'device',
                  attributes: ['id', 'name', 'device_identifier'],
                },
              ],
            },
          ],
        });
        return res.json(cargoCreated);
      }

      const ordersIds = [];
      ordersIdsFromReq.map((order) => {
        return ordersIds.push(order.id);
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

      if (ordersFromDB.length !== ordersIds.length) {
        await transaction.rollback();
        return res.status(400).json({
          error:
            'There is one or more order already in a cargo, review your choices.',
        });
      }

      await cargo.addOrders(ordersFromDB, {
        as: 'order_id',
        through: { employee_id: req.userId, scanned: false },
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

      await cargo.update(
        {
          status: StatusCargo.CLOSED.value,
          observation: StatusCargo.CLOSED.description,
        },
        { transaction }
      );

      // await cargo.createCargosGeolocation(
      //   {
      //     status: StatusCargo.CLOSED.value,
      //     observation: StatusCargo.CLOSED.description,
      //   },
      //   { transaction }
      // );

      // await checkVehicleHasDevice.createVehiclesGeolocation(
      //   {
      //     cargo_id: cargo.id,
      //     status: StatusCargo.CLOSED.value,
      //     observation: StatusCargo.CLOSED.description,
      //     transaction,
      //   },
      //   { transaction }
      // );

      // await VehiclesGeolocation.create(
      //   {
      //     vehicle_id: checkVehicleHasDevice.id,
      //     cargo_id: cargo.id,
      //     status: StatusCargo.CLOSED.value,
      //     observation: StatusCargo.CLOSED.description,
      //   },
      //   { transaction }
      // );

      await transaction.commit();

      const cargoOrders = await Cargo.findByPk(cargo.id, {
        attributes: [
          'id',
          'cargo_number',
          'plan_delivery_date_leave',
          'plan_delivery_date_return',
          'status',
          'observation',
          'createdAt',
        ],
        include: [
          {
            association: 'driver',
            attributes: ['id', 'name', 'last_name', 'telephone', 'email'],
          },
          {
            association: 'vehicle',
            attributes: ['id', 'license_plate', 'model', 'brand', 'reference'],
            include: [
              {
                association: 'device',
                attributes: ['id', 'name', 'device_identifier'],
              },
            ],
          },
          {
            association: 'orders',
            attributes: [
              'id',
              'order_number',
              'quantity',
              'freight',
              'total_price',
              'status',
            ],
            through: {
              attributes: ['scanned', 'employee_id'],
              as: 'other_infos',
            },
            include: [
              {
                association: 'product',
                attributes: ['id', 'name', 'description'],
              },
              {
                association: 'user',
                attributes: ['id', 'name', 'last_name', 'telephone', 'email'],
              },
              {
                association: 'delivery_adress',
                attributes: [
                  'id',
                  'cep',
                  'address',
                  'number',
                  'complement',
                  'district',
                  'city',
                  'state',
                ],
              },
            ],
          },
        ],
      });
      return res.json(cargoOrders);
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      return res.status(400).json({
        error:
          'An unexpected error occurred, please contact system administrator! ',
      });
    }
  }

  async index(req, res) {
    const { cargo_number } = req.query;
    const filterCargoNumber = cargo_number
      ? { [Op.eq]: cargo_number.toUpperCase() }
      : { [Op.not]: null };

    let transaction;
    try {
      const cargos = await Cargo.findAll({
        where: { cargo_number: filterCargoNumber },
        order: [
          // ['status', 'ASC'],
          ['delivery_date_return', 'DESC'],
          ['delivery_date_leave', 'DESC'],
          // ['plan_delivery_date_leave', 'DESC'],
        ],
        attributes: [
          'id',
          'cargo_number',
          'plan_delivery_date_leave',
          'plan_delivery_date_return',
          'delivery_date_leave',
          'delivery_date_return',
          'status',
          'observation',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: User,
            as: 'driver',
            attributes: [
              'name',
              'last_name',
              'full_name',
              'telephone',
              'email',
            ],
          },
          {
            model: Vehicle,
            as: 'vehicle',
            attributes: [
              'id',
              'license_plate',
              'barcode_scan',
              'model',
              'brand',
              'reference',
            ],
            include: [
              {
                association: 'device',
                attributes: ['id', 'name', 'device_identifier'],
              },
            ],
          },
          {
            model: Order,
            as: 'orders',
            attributes: [
              'id',
              'order_number',
              'barcode_scan',
              'quantity',
              'freight',
              'total_price',
              'status',
              'observation',
              'updated_at',
            ],
            through: {
              attributes: ['scanned', 'employee_id'],
              as: 'other_infos',
            },
            include: [
              {
                association: 'product',
                attributes: ['id', 'name', 'description'],
              },
              {
                association: 'user',
                attributes: [
                  'id',
                  'name',
                  'last_name',
                  'full_name',
                  'telephone',
                  'email',
                ],
              },
              {
                association: 'delivery_adress',
                attributes: [
                  'id',
                  'cep',
                  'address',
                  'number',
                  'complement',
                  'district',
                  'city',
                  'state',
                ],
              },
            ],
          },
        ],
      });
      return res.json(cargos);
    } catch (err) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({
        error:
          'An unexpected error occurred, please contact system administrator! ',
      });
    }
  }

  async update(req, res) {
    let transaction;

    const schema = Yup.object().shape({
      id: Yup.string().required(),
      cargo_number: Yup.string().required(),
      status: Yup.string().required(),
      orders: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required(),
          order_number: Yup.string().required(),
          status: Yup.string().required(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
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

      if (!(req.body.status in StatusCargo)) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Invalid cargo status!',
        });
      }

      if (!cargo) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Cargo not found in database!',
        });
      }

      let invalidStatus = false;
      const ordersIds = [];
      req.body.orders.map((order) => {
        if (!(order.status in StatusOrder)) {
          invalidStatus = true;
        }
        return ordersIds.push(order.id);
      });

      if (invalidStatus) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Invalid order status!',
        });
      }

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
          error:
            'There is one or more orders from this cargo missing in request!',
        });
      }

      await cargo.update(
        {
          status: req.body.status,
          observation: req.body.observation,
          delivery_date_return:
            req.body.status === StatusCargo.FINISHED.value ? new Date() : null,
        },
        { transaction }
      );

      const promises = [];
      // const ordersUpdated = [];
      for await (const order of req.body.orders) {
        const orderUpdated = await Order.update(
          {
            status: order.status,
            observation: order.observation,
          },
          {
            where: {
              id: order.id,
            },
            transaction,
          }
        );
        await OrdersHistory.create(
          {
            order_id: order.id,
            status: order.status,
            observation: order.observation,
          },
          { transaction }
        );
        // ordersUpdated.push(orderUpdated);
        promises.push(orderUpdated);
      }
      await Promise.all(promises);

      // const promises2 = [];
      // await Promise.all(promises);
      // for await (const orderToBeInsertHistory of ordersUpdated) {
      //   const orderHistInserted = await orderToBeInsertHistory.createOrdersHistory(
      //     {
      //       status: orderToBeInsertHistory.status,
      //       observation: orderToBeInsertHistory.observation,
      //     },
      //     { transaction }
      //   );

      //   promises2.push(orderHistInserted);
      // }

      // await Promise.all(promises2);

      await transaction.commit();
      const cargoResult = await Cargo.findByPk(cargo.id, {
        attributes: [
          'id',
          'cargo_number',
          'plan_delivery_date_leave',
          'plan_delivery_date_return',
          'status',
          'observation',
          'createdAt',
        ],
        include: [
          {
            association: 'driver',
            attributes: [
              'id',
              'name',
              'last_name',
              'telephone',
              'email',
              'full_name',
            ],
          },
          {
            association: 'vehicle',
            attributes: ['id', 'license_plate', 'model', 'brand', 'reference'],
            include: [
              {
                association: 'device',
                attributes: ['id', 'name', 'device_identifier'],
              },
            ],
          },
          {
            association: 'orders',
            attributes: [
              'id',
              'order_number',
              'quantity',
              'freight',
              'total_price',
              'status',
              'observation',
              'updatedAt',
            ],
            through: {
              attributes: ['scanned', 'employee_id'],
              as: 'other_infos',
            },
            include: [
              {
                association: 'product',
                attributes: ['id', 'name', 'description'],
              },
              {
                association: 'user',
                attributes: ['id', 'name', 'last_name', 'telephone', 'email'],
              },
              {
                association: 'delivery_adress',
                attributes: [
                  'id',
                  'cep',
                  'address',
                  'number',
                  'complement',
                  'district',
                  'city',
                  'state',
                  'latitude',
                  'longitude',
                  'relevance',
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
          'An unexpected error occurred, please contact system administrator! ',
      });
    }
  }
}

export default new CargoController();
