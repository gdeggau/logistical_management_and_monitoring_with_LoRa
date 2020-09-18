import * as Yup from "yup";
import { Op } from "sequelize";
import Vehicle from "../models/Vehicle";
import Device from "../models/Device";
import Order from "../models/Order";

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

    const vehicle = req.body;

    const vehicleExists = await Vehicle.findOne({
      where: { license_plate: vehicle.license_plate },
    });

    if (vehicleExists) {
      return res.status(400).json({ error: "Vehicle already exists" });
    }

    const {
      id,
      license_plate,
      model,
      brand,
      reference,
      active,
      device_id,
    } = await Vehicle.create(vehicle);

    return res.json({
      id,
      license_plate,
      model,
      brand,
      reference,
      active,
      device_id,
    });
  }

  async index(req, res) {
    const vehicles = await Vehicle.findAll({
      where: {
        active: true,
        device_id: {
          [Op.ne]: null,
        },
      },
      attributes: [
        "id",
        "license_plate",
        "model",
        "brand",
        "reference",
        "active",
      ],
      include: [
        {
          model: Device,
          as: "device",
          attributes: ["id", "name", "device_identifier"],
        },
      ],
    });

    return res.json(vehicles);
  }
}

export default new VehicleController();
