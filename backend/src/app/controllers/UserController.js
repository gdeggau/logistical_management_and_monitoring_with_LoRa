//o * as é pq o Yup nao tem um export default
import * as Yup from "yup";
import User from "../models/User";

import sequelizeInstance from "../../database/index";

import Adress from "../models/Adress";
import File from "../models/File";

class UserController {
  async store(req, res) {
    let transaction;
    let userCreated;
    let adressCreated;
    try {
      const schemaUser = Yup.object().shape({
        name: Yup.string().required(),
        last_name: Yup.string().required(),
        email: Yup.string().email().required(),
        telephone: Yup.string().notRequired(),
        password: Yup.string().required().min(6),
      });
      const schemaAddress = Yup.object().shape({
        cep: Yup.string().required(),
        address: Yup.string().required(),
        number: Yup.number().notRequired(),
        complement: Yup.string().notRequired(),
        district: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().required(),
      });

      const { adress, ...user } = req.body;

      if (!(await schemaUser.isValid(user))) {
        return res.status(400).json({ error: "User's validation fails" });
      }

      // if (!(await schemaAddress.isValid(adress))) {
      //   return res.status(400).json({ error: "Addresse's validation fails" });
      // }

      transaction = await sequelizeInstance.connection.transaction();
      const userExists = await User.findOne({ where: { email: user.email } });

      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      userCreated = await User.create(user, { transaction });
      // adressCreated = await Adress.create(adress, { transaction });

      // await userCreated.addAdresses(adressCreated, {
      //   through: { main_adress: true },
      //   transaction,
      // });

      const useradress = await User.findByPk(userCreated.id, {
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
          // where: {
          //   id: adressCreated.id,
          // },
          through: {
            attributes: ["main_adress", "delivery_adress", "active"],
            as: "options",
          },
        },
        transaction,
      });

      await transaction.commit();

      return res.json(useradress);
    } catch (err) {
      // console.log(err);
      if (transaction) await transaction.rollback();
      return res.status(400).json({
        error:
          "An unexpected error occurred, please contact system administrator! ",
      });
    }
  }

  async update(req, res) {
    console.log(req.body);
    const schema = Yup.object().shape({
      name: Yup.string(),
      last_name: Yup.string(),
      email: Yup.string().email(),
      telephone: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
      //fiel é o password
      //não tem return na função pois n foi declarado o corpo
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email != user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password does not match" });
    }

    await user.update(req.body);

    const {
      id,
      name,
      last_name,
      telephone,
      role,
      avatar,
    } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["id", "path", "url"],
        },
      ],
    });
    return res.json({
      id,
      name,
      last_name,
      email,
      telephone,
      role,
      avatar,
    });
  }
}

export default new UserController();
