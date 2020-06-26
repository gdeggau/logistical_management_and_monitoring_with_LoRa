import * as Yup from "yup";
import Order from "../models/Order";

import Adress from "../models/Adress";
import UserAdresses from "../models/UsersAdresses";
import Product from "../models/Product";
import User from "../models/User";

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product_id: Yup.string().required(),
      quantity: Yup.number().min(1).required(),
      delivery_adress_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails!" });
    }

    const product = await Product.findOne({
      where: { id: req.body.product_id },
    });
    const userAdress = await UserAdresses.findOne({
      where: { user_id: req.userId, adress_id: req.body.delivery_adress_id },
    });

    //verify address of user
    if (!userAdress) {
      return res
        .status(400)
        .json({ error: "No address was found, please provide another one!" });
    }

    // verify if exists product
    if (!product) {
      return res.status(400).json({ error: "Product not exists!" });
    }

    const freight = Math.floor(Math.random() * (40 - 0 + 1) + 0);
    const cost_products = product.price * req.body.quantity;
    const total_price = cost_products + freight;
    const status = "PENDING";
    const observation = "Order waiting to be delivered.";

    const {
      id,
      user_id,
      order_number,
      product_id,
      delivery_adress_id,
      quantity,
    } = await Order.create({
      user_id: req.userId,
      product_id: req.body.product_id,
      delivery_adress_id: userAdress.adress_id,
      quantity: req.body.quantity,
      freight,
      total_price,
      status,
      observation,
    });

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
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const orders = await Order.findAll({
      where: { user_id: req.userId },
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
      limit: 20,
      offset: (page - 1) * 20,
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
