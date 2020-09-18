import * as Yup from "yup";
import User from "../models/User";
import Adress from "../models/Adress";

import sequelizeInstance from "../../database/index";
import UsersAdresses from "../models/UsersAdresses";

class UserAdressesController {
  async store(req, res) {
    let transaction;
    try {
      const schemaAddress = Yup.object().shape({
        cep: Yup.string().required(),
        address: Yup.string().required(),
        number: Yup.number().required(),
        complement: Yup.string().notRequired(),
        district: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().required(),
      });

      if (!(await schemaAddress.isValid(req.body))) {
        return res
          .status(400)
          .json({ error: "User address's validation fails" });
      }

      transaction = await sequelizeInstance.connection.transaction();
      const user = await User.findByPk(req.userId);

      const adressCreated = await Adress.create(req.body, { transaction });

      const { count } = await UsersAdresses.findAndCountAll({
        where: {
          user_id: req.userId,
          main_adress: true,
        },
      });

      await user.addAdresses(adressCreated, {
        through: { main_adress: count === 0 ? true : false },
        transaction,
      });

      const userAdress = await User.findByPk(req.userId, {
        attributes: ["id", "name", "last_name", "telephone", "email", "role"],
        joinTableAttributes: ["main_adress", "delivery_adress"],
        include: {
          association: "adresses",
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
          where: {
            id: adressCreated.id,
          },
          through: {
            attributes: ["main_adress", "delivery_adress", "active"],
            as: "options",
          },
        },
        transaction,
      });

      await transaction.commit();

      return res.json(userAdress);
    } catch (err) {
      console.log(err);
      if (transaction) await transaction.rollback();
      return res.status(400).json({
        error:
          "An unexpected error occurred, please contact system administrator! ",
      });
    }
  }

  async index(req, res) {
    // const { page = 1 } = req.query;
    const adresses = await User.findByPk(req.userId, {
      attributes: ["id", "name", "last_name", "telephone", "email", "role"],
      limit: 20,
      // offset: (page - 1) * 20,
      include: {
        model: Adress,
        as: "adresses",
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
        through: {
          attributes: ["main_adress", "active"],
          as: "options",
        },
      },
    });

    return res.json(adresses);
  }
}

export default new UserAdressesController();
