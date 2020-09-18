import * as Yup from "yup";
import { Op } from "sequelize";
import Order from "../models/Order";
import Adress from "../models/Adress";
import UserAdresses from "../models/UsersAdresses";
import Product from "../models/Product";
import User from "../models/User";

import StatusOrder from "../utils/EnumStatusOrder";

import sequelizeInstance from "../../database/index";

class OrderController {
  async index(req, res) {
    // const { page = 1 } = req.query;

    let { status } = req.query;

    console.log(status);
    status = !status
      ? [StatusOrder.PENDING.value, StatusOrder.RETURNED.value]
      : status;

    console.log(status);

    const orders = await Order.findAll({
      where: {
        status: {
          [Op.any]: [status],
        },
      },
      order: [["created_at", "DESC"]],
      attributes: [
        "id",
        "order_number",
        "quantity",
        "freight",
        "total_price",
        "status",
        "observation",
        "created_at",
      ],
      // limit: 20,
      // offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "last_name", "telephone", "email"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["name", "description", "price"],
        },
        {
          model: Adress,
          as: "delivery_adress",
          attributes: [
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
    });

    return res.json(orders);
  }
}

export default new OrderController();
