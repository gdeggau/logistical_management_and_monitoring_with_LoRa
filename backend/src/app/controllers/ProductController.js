import * as Yup from "yup";
import Product from "../models/Product";

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
}

export default new ProductController();
