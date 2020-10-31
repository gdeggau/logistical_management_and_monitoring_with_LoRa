import * as Yup from 'yup';
import Order from '../models/Order';

import Adress from '../models/Adress';
import UserAdresses from '../models/UsersAdresses';
import Product from '../models/Product';
import User from '../models/User';

import StatusOrder from '../utils/EnumStatusOrder';

import sequelizeInstance from '../../database/index';
import OrdersHistory from '../models/OrdersHistory';

class UserOrderController {
  async store(req, res) {
    let transaction;
    try {
      const schema = Yup.object().shape({
        product_id: Yup.string().required(),
        quantity: Yup.number().min(1).required(),
        freight: Yup.number().required(),
        delivery_adress_id: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' });
      }
      transaction = await sequelizeInstance.connection.transaction();
      const product = await Product.findOne({
        where: { id: req.body.product_id },
        transaction,
      });
      const userAdress = await UserAdresses.findOne({
        where: { user_id: req.userId, adress_id: req.body.delivery_adress_id },
        transaction,
      });

      // verify address of user
      if (!userAdress) {
        transaction.rollback();
        return res
          .status(400)
          .json({ error: 'No address was found, please provide another one!' });
      }

      // verify if exists product
      if (!product) {
        transaction.rollback();
        return res.status(400).json({ error: 'Product not exists!' });
      }

      // const freight = Math.floor(Math.random() * (40 - 0 + 1) + 0);
      const cost_products = product.price * req.body.quantity;
      const total_price = cost_products + req.body.freight;
      const status = StatusOrder.PENDING.value;
      const observation = StatusOrder.PENDING.description;

      // const {
      //   id,
      //   user_id,
      //   order_number,
      //   product_id,
      //   delivery_adress_id,
      //   freight,
      //   quantity,
      // }

      const orderCreated = await Order.create(
        {
          user_id: req.userId,
          product_id: req.body.product_id,
          delivery_adress_id: userAdress.adress_id,
          quantity: req.body.quantity,
          freight: req.body.freight,
          total_price,
          status,
          observation,
          // orders_history: {
          //   status: StatusOrder.PENDING.value,
          //   observation: StatusOrder.PENDING.description,
          // },
        },
        {
          // include: [
          //   {
          //     model: OrdersHistory
          //   },
          // ],
          transaction,
        }
      );

      const {
        id,
        user_id,
        order_number,
        product_id,
        delivery_adress_id,
        freight,
        quantity,
      } = orderCreated;

      await orderCreated.createOrdersHistory(
        {
          status: StatusOrder.PENDING.value,
          observation: StatusOrder.PENDING.description,
        },
        { transaction }
      );

      await transaction.commit();

      return res.json({
        id,
        order_number,
        user_id,
        product_id,
        delivery_adress_id,
        quantity,
        freight,
        total_price,
        status,
        observation,
      });
    } catch (err) {
      console.log(err);
      if (transaction) await transaction.rollback();
      return res.status(400).json({
        error:
          'An unexpected error occurred, please contact system administrator! ',
      });
    }
  }

  async index(req, res) {
    // const { page = 1 } = req.query;
    const orders = await Order.findAll({
      where: { user_id: req.userId },
      order: [
        ['created_at', 'DESC'],
        [OrdersHistory, 'created_at', 'ASC'],
      ],
      attributes: [
        'id',
        'order_number',
        'quantity',
        'freight',
        'total_price',
        'status',
        'observation',
        'created_at',
        'updated_at',
      ],
      // limit: 20,
      // offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'full_name', 'last_name', 'telephone', 'email'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'description', 'price'],
        },
        {
          model: Adress,
          as: 'delivery_adress',
          attributes: [
            'cep',
            'address',
            'number',
            'complement',
            'district',
            'city',
            'state',
          ],
        },
        {
          model: OrdersHistory,
          // as: 'orders_history',
          attributes: ['id', 'status', 'observation', 'created_at'],
        },
      ],
    });

    return res.json(orders);
  }
}

export default new UserOrderController();
