import * as Yup from "yup";

import Vehicle from "../models/Vehicle";
import Device from "../models/Device";

class VehicleController {
  async store(req, res) {
    const schema = Yup.object().shape({
      license_plate: Yup.string().required(),
      model: Yup.string().required(),
      brand: Yup.string().notRequired(),
      reference: Yup.string().notRequired(),
      active: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { device, ...vehicle } = req.body;

    const vehicleExists = await Vehicle.findOne({
      where: { license_plate: vehicle.license_plate },
    });

    if (vehicleExists) {
      return res.status(400).json({ error: "Vehicle already exists" });
    }

    if (device) {
      vehicle.device_id = device.id;
    }

    const {
      id,
      license_plate,
      model,
      brand,
      reference,
      active,
    } = await Vehicle.create(vehicle);

    return res.json({
      id,
      license_plate,
      model,
      brand,
      reference,
      active,
      device,
    });
  }
}

export default new VehicleController();
