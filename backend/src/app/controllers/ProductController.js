import * as Yup from "yup";
import Product from "../models/Product";
import User from "../models/User";

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().notRequired(),
      price: Yup.number().positive().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const productExists = await Product.findOne({
      where: { name: req.body.name },
    });

    if (productExists) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const {
      id,
      name,
      description,
      price,
      image_id,
      active,
    } = await Product.create(req.body);

    return res.json({
      id,
      name,
      description,
      price,
      image_id,
      active,
    });
  }

  async index(req, res) {
    const products = await Product.findAll({
      where: { active: true },
    });

    return res.json(products);
  }
}

export default new ProductController();
