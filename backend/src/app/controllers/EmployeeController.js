import User from "../models/User";
import File from "../models/File";
import { next } from "sucrase/dist/parser/tokenizer";

class EmployeeController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { employee: true },
      attributes: [
        "id",
        "name",
        "last_name",
        "telephone",
        "email",
        "avatar_id",
      ],
      include: [
        { model: File, as: "avatar", attributes: ["name", "path", "url"] },
      ],
    });

    return res.json(providers);
  }
}

export default new EmployeeController();
