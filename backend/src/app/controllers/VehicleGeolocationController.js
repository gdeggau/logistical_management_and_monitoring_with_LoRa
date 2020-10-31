import * as Yup from 'yup';
import VehiclesGeolocation from '../models/VehiclesGeolocation';
import Vehicle from '../models/Vehicle';
import Cargo from '../models/Cargo';
// import Device from '../models/Device';
import sequelizeInstance from '../../database/index';
import StatusCargo from '../utils/EnumStatusCargo';
// import StatusOrder from '../utils/EnumStatusOrder';

function splitString(str) {
  const middle = Math.ceil(str.length / 2);
  const s1 = str.slice(0, middle);
  const s2 = str.slice(middle);
  return [s1, s2];
}

function hexToSignedInt(hex) {
  if (hex.length % 2 !== 0) {
    hex = `0${hex}`;
  }
  let num = parseInt(hex, 16);
  const maxVal = 2 ** ((hex.length / 2) * 8);
  if (num > maxVal / 2 - 1) {
    num -= maxVal;
  }
  return num;
}

class VehiclesGeolocationController {
  async store(req, res) {
    let transaction;

    const schema = Yup.object().shape({
      type: Yup.string().required(),
      meta: Yup.object().shape({
        application: Yup.string().required(),
        device_addr: Yup.string().required(),
        device: Yup.string().required(),
      }),
      params: Yup.object().shape({
        payload: Yup.string().required(),
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    if (req.body.type !== 'uplink') {
      return res
        .status(400)
        .json({ error: 'This route only accepts uplink messages!' });
    }

    try {
      transaction = await sequelizeInstance.connection.transaction();

      const vehicle = await Vehicle.findOne(
        {
          include: [
            {
              association: 'device',
              where: {
                device_identifier: req.body.meta.device,
              },
            },
          ],
        },
        { transaction }
      );

      if (!vehicle) {
        await transaction.rollback();
        return res.status(400).json({
          error:
            'No device was found in database associated with a vehicle with EUI provided, please contact system administrator!',
        });
      }

      const coordsHex = Buffer.from(req.body.params.payload, 'base64').toString(
        'hex'
      );
      const hexSplited = splitString(coordsHex);
      const latHex = hexSplited[0];
      const lonHex = hexSplited[1];

      const latitude = hexToSignedInt(latHex) / 100000;
      const longitude = hexToSignedInt(lonHex) / 100000;

      const cargo = await Cargo.findOne({
        where: {
          status: StatusCargo.ONDELIVERY.value,
          vehicle_id: vehicle.id,
        },
        transaction,
      });

      console.log(vehicle, cargo, latitude, longitude);

      await VehiclesGeolocation.create(
        {
          vehicle_id: vehicle.id,
          latitude,
          longitude,
          cargo_id: cargo ? cargo.id : null,
          status: cargo
            ? StatusCargo.ONDELIVERY.value
            : StatusCargo.EMPTY.value,
          observation: cargo ? StatusCargo.ONDELIVERY.description : null,
        },
        { transaction }
      );

      await transaction.commit();

      return res.end();
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      return res.status(400).json({
        error:
          'An unexpected error occurred, please contact system administrator! ',
      });
    }
  }
}

export default new VehiclesGeolocationController();
