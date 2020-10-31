/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import sequelizeInstance from '../../database/index';
import Vehicle from '../models/Vehicle';
import Cargo from '../models/Cargo';
import User from '../models/User';
import Order from '../models/Order';
import CargosOrders from '../models/CargosOrders';
import StatusCargo from '../utils/EnumStatusCargo';
import StatusOrder from '../utils/EnumStatusOrder';
import VehiclesGeolocation from '../models/VehiclesGeolocation';

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
      return res.status(400).json({ error: 'Validation fails!' });
    }

    try {
      transaction = await sequelizeInstance.connection.transaction();

      const cargo = await Cargo.findOne(
        {
          where: {
            id: req.body.id,
            cargo_number: req.body.cargo_number,
            status: { [Op.ne]: StatusCargo.ONDELIVERY.value },
          },
        },
        { transaction }
      );

      if (!cargo) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Cargo is already on delivery or do not exist in database!',
        });
      }

      const ordersIds = [];
      req.body.orders.map((order) => {
        return ordersIds.push(order.id);
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
          error: 'There is one or more orders from this cargo missing scan!',
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
      // await cargo.createVehiclesGeolocation(
      //   {
      //     status: StatusCargo.ONDELIVERY.value,
      //     observation: StatusCargo.ONDELIVERY.description,
      //   },
      //   { transaction }
      // );

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

  async index(req, res) {
    const { cargo_number, status } = req.query;

    let filterStatus;

    if (!status || status === 'ALL') {
      filterStatus = {
        [Op.or]: [StatusCargo.ONDELIVERY.value, StatusCargo.FINISHED.value],
      };
    } else if (status === StatusCargo.ONDELIVERY.value) {
      filterStatus = StatusCargo.ONDELIVERY.value;
    } else {
      filterStatus = StatusCargo.FINISHED.value;
    }

    let transaction;
    try {
      transaction = await sequelizeInstance.connection.transaction();
      const cargos = await Cargo.findAll(
        {
          where: {
            cargo_number: cargo_number || { [Op.ne]: null },
            status: filterStatus,
          },
          order: [['created_at', 'ASC']],
          attributes: [
            'id',
            'cargo_number',
            'plan_delivery_date_return',
            'delivery_date_leave',
            'delivery_date_return',
            'status',
            'observation',
            'createdAt',
          ],
          include: [
            {
              model: User,
              as: 'driver',
              attributes: [
                'name',
                'last_name',
                'telephone',
                'email',
                'full_name',
              ],
            },
            {
              model: Vehicle,
              as: 'vehicle',
              attributes: [
                'id',
                'barcode_scan',
                'license_plate',
                'model',
                'brand',
                'reference',
              ],
              include: [
                {
                  association: 'device',
                  attributes: ['name', 'device_identifier'],
                },
                // {
                //   model: VehiclesGeolocation,
                //   // as: 'vehicle',
                //   attributes: ['cargo_id', 'latitude', 'longitude', 'created_at'],
                //   order: [['created_at', 'ASC']],
                //   // where: {
                //   //   cargo_id: Sequelize.col('cargo.id')
                //   //   // status: StatusCargo.ONDELIVERY.value,
                //   // },
                // },
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
                    'latitude',
                    'longitude',
                    'relevance',
                  ],
                },
              ],
            },
          ],
        },
        { transaction }
      );

      const payloadRes = await Promise.all(
        cargos.map(async (cargo) => {
          const vehicle_geolocations = await VehiclesGeolocation.findAll(
            {
              attributes: [
                'id',
                'cargo_id',
                'vehicle_id',
                'status',
                'observation',
                'latitude',
                'longitude',
                'created_at',
              ],
              order: [['created_at', 'DESC']],
              where: { cargo_id: cargo.id },
            },
            { transaction }
          );
          cargo.setDataValue('vehicle_geolocations', vehicle_geolocations);

          return cargo;
        })
      );

      // const cargosTest = await sequelizeInstance.connection.query(
      //   `SELECT "Cargo"."id", "Cargo"."cargo_number", "Cargo"."plan_delivery_date_return", "Cargo"."delivery_date_leave", "Cargo"."delivery_date_return", "Cargo"."status", "Cargo"."observation", "Cargo"."created_at" AS "createdAt", "driver"."id" AS "driver.id", "driver"."name" AS "driver.name", "driver"."last_name" AS "driver.last_name", "driver"."telephone" AS "driver.telephone", "driver"."email" AS
      //   "driver.email", "vehicle"."id" AS "vehicle.id", "vehicle"."license_plate" AS "vehicle.license_plate", "vehicle"."model" AS "vehicle.model", "vehicle"."brand" AS "vehicle.brand", "vehicle"."reference" AS "vehicle.reference", "vehicle->device"."id" AS "vehicle.device.id", "vehicle->device"."name" AS "vehicle.device.name", "vehicle->device"."device_identifier" AS "vehicle.device.device_identifier", "vehicle->VehiclesGeolocations"."id" AS "vehicle.VehiclesGeolocations.id", "vehicle->VehiclesGeolocations"."cargo_id" AS
      //   "vehicle.VehiclesGeolocations.cargo_id", "vehicle->VehiclesGeolocations"."latitude" AS "vehicle.VehiclesGeolocations.latitude", "vehicle->VehiclesGeolocations"."longitude" AS "vehicle.VehiclesGeolocations.longitude", "vehicle->VehiclesGeolocations"."created_at" AS "vehicle.VehiclesGeolocations.created_at", "orders"."id" AS "orders.id", "orders"."order_number" AS "orders.order_number", "orders"."quantity" AS "orders.quantity", "orders"."freight" AS "orders.freight", "orders"."total_price" AS "orders.total_price", "orders"."status" AS "orders.status", "orders"."observation" AS "orders.observation", "orders"."updated_at" AS "orders.updated_at", "orders->other_infos"."id" AS "orders.other_infos.id", "orders->other_infos"."scanned" AS "orders.other_infos.scanned", "orders->other_infos"."created_at" AS "orders.other_infos.createdAt", "orders->other_infos"."updated_at" AS "orders.other_infos.updatedAt", "orders->other_infos"."order_id" AS "orders.other_infos.order_id", "orders->other_infos"."cargo_id" AS "orders.other_infos.cargo_id", "orders->other_infos"."employee_id" AS "orders.other_infos.employee_id", "orders->product"."id" AS "orders.product.id", "orders->product"."name" AS "orders.product.name", "orders->product"."description" AS "orders.product.description", "orders->user"."id" AS "orders.user.id", "orders->user"."name" AS "orders.user.name", "orders->user"."last_name" AS "orders.user.last_name", "orders->user"."telephone" AS "orders.user.telephone", "orders->user"."email" AS "orders.user.email", "orders->delivery_adress"."id" AS "orders.delivery_adress.id", "orders->delivery_adress"."cep" AS "orders.delivery_adress.cep", "orders->delivery_adress"."address" AS "orders.delivery_adress.address", "orders->delivery_adress"."number" AS "orders.delivery_adress.number", "orders->delivery_adress"."complement" AS "orders.delivery_adress.complement", "orders->delivery_adress"."district" AS "orders.delivery_adress.district", "orders->delivery_adress"."city" AS "orders.delivery_adress.city", "orders->delivery_adress"."state" AS "orders.delivery_adress.state", "orders->delivery_adress"."latitude" AS "orders.delivery_adress.latitude", "orders->delivery_adress"."longitude" AS "orders.delivery_adress.longitude", "orders->delivery_adress"."relevance" AS "orders.delivery_adress.relevance" FROM "cargos" AS "Cargo" LEFT OUTER JOIN "users" AS "driver" ON "Cargo"."driver_id" = "driver"."id" LEFT OUTER JOIN ( "vehicles" AS "vehicle" LEFT OUTER JOIN "devices" AS "vehicle->device" ON "vehicle"."device_id" = "vehicle->device"."id" INNER JOIN "vehicles_geolocations" AS "vehicle->VehiclesGeolocations" ON "vehicle"."id" = "vehicle->VehiclesGeolocations"."vehicle_id" AND "vehicle->VehiclesGeolocations"."status" = 'ONDELIVERY' ) ON "Cargo"."vehicle_id" = "vehicle"."id" LEFT OUTER JOIN (
      //   "cargos_orders" AS "orders->other_infos" INNER JOIN "orders" AS "orders" ON "orders"."id" = "orders->other_infos"."order_id") ON "Cargo"."id" = "orders->other_infos"."cargo_id" LEFT OUTER JOIN "products" AS "orders->product" ON "orders"."product_id" = "orders->product"."id" LEFT OUTER JOIN "users" AS "orders->user" ON "orders"."user_id" = "orders->user"."id" LEFT OUTER JOIN "adresses" AS "orders->delivery_adress" ON "orders"."delivery_adress_id" = "orders->delivery_adress"."id" WHERE "Cargo"."status" = 'ONDELIVERY';`,
      //   {
      //     nest: true,
      //     type: QueryTypes.SELECT,
      //   }
      // );
      await transaction.commit();
      return res.json(payloadRes);
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      return res.status(400).json({
        error:
          'An unexpected error occurred, please contact system administrator! ',
      });
    }
  }

  async status(req, res) {
    return res.json(StatusCargo);
  }
}

export default new CargoDeliveryController();
