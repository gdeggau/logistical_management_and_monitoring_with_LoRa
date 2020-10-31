import * as Yup from 'yup';
import Device from '../models/Device';

class DeviceController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      label: Yup.string().required(),
      device_identifier: Yup.string()
        .required('Device EUI is required')
        .min(16, 'DevEUI must be a 8 bytes hex!')
        .max(16, 'DevEUI must be a 8 bytes hex!'),
      description: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const deviceExists = await Device.findOne({
      where: { device_identifier: req.body.device_identifier },
    });

    if (deviceExists) {
      return res.status(400).json({ error: 'Device already exists' });
    }

    const device = await Device.create(req.body);

    return res.json(device);
  }

  async index(req, res) {
    const devices = await Device.findAll({
      where: {
        active: true,
      },
      include: [
        {
          association: 'vehicles',
        },
      ],
    });

    return res.json(devices);
  }

  // async show(req,res) {

  // }
}

export default new DeviceController();
