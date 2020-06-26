//o * as é pq o Yup nao tem um export default
import * as Yup from "yup";
import User from "../models/User";

import Adress from "../models/Adress";

class UserController {
  async store(req, res) {
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

    if (!(await schemaAddress.isValid(adress))) {
      return res.status(400).json({ error: "Addresse's validation fails" });
    }

    const userExists = await User.findOne({ where: { email: user.email } });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const userCreated = await User.create(user);
    const adressCreated = await Adress.create(adress);

    await userCreated.addAdresses(adressCreated, {
      through: { main_adress: true },
    });

    // const useradress = await User.findByPk(userCreated.id, {
    //   attributes: ["id", "name", "last_name", "telephone", "email", "employee"],
    //   include: {
    //     association: "adresses",
    //     attributes: [
    //       "id",
    //       "cep",
    //       "address",
    //       "number",
    //       "complement",
    //       "district",
    //       "city",
    //       "state",
    //     ],
    //     where: {
    //       id: adressCreated.id,
    //     },
    //     through: {
    //       attributes: ["main_adress", "delivery_adress"],
    //       as: "options",
    //     },
    //   },
    // });
    const useradress = await User.findByPk(userCreated.id, {
      attributes: ["id", "name", "last_name", "telephone", "email", "employee"],
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
    });

    return res.json(useradress);
    // return res.json({
    //   id,
    //   name,
    //   last_name,
    //   email,
    //   telephone,
    //   employee,
    //   userAdress,
    // });
    // return next();
  }

  async update(req, res) {
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

    const { id, name, last_name, telephone, employee } = await user.update(
      req.body
    );

    return res.json({
      id,
      name,
      last_name,
      email,
      telephone,
      employee,
    });
  }
}

export default new UserController();
