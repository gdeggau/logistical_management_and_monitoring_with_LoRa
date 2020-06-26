import UserAdresses from "../models/UsersAdresses";
import * as Yup from "yup";

class UserAdressesController {
  async store(req, res, next) {
    const schema = Yup.object().shape({
      user_id: Yup.string().required(),
      adress_id: Yup.string().required(),
    });

    if (!(await schema.isValid(schema))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    await UserAdresses.create({
      user_id: req.user_id,
      adress_id: req.adress_id,
    });

    return next();
  }
}

export default new UserAdressesController();
