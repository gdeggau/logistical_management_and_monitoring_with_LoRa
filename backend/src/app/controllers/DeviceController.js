import * as Yup from "yup";
import Device from "../models/Device";

class DeviceController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      device_identifier: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fail" });
    }

    const deviceExists = await Device.findOne({
      where: { device_identifier: req.body.device_identifier },
    });

    if (deviceExists) {
      return res.status(400).json({ error: "Device already exists" });
    }

    const { id, name, device_identifier } = await Device.create(req.body);

    return res.json({ id, name, device_identifier });
  }

  // async show(req,res) {

  // }
}

export default new DeviceController();
