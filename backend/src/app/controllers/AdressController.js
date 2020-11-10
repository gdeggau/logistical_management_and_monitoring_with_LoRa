import * as Yup from 'yup';
import Adress from '../models/Adress'

class AddressController {
  async store(req, res, next) {
    const schema = Yup.object().shape({
      cep: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().notRequired(),
      complement: Yup.string().notRequired(),
      district: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
    });

    let objectAdress = {};
    if (req.body.adress) {
      objectAdress = req.body.adress;
    } else {
      objectAdress = req.body;
    }

    if (!(await schema.isValid(objectAdress))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const address = await Adress.create(objectAdress);

    req.adress_id = address.id;

    return next();
  }
}

export default new AddressController();
