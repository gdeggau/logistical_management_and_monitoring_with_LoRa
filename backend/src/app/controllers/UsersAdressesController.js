import * as Yup from 'yup';
import axios from 'axios';
import { Op } from 'sequelize';
import mapboxConfig from '../../config/mapbox';
import User from '../models/User';
import Adress from '../models/Adress';
import sequelizeInstance from '../../database/index';
import UsersAdresses from '../models/UsersAdresses';

class UserAdressesController {
  async store(req, res) {
    let transaction;
    try {
      const schemaAddress = Yup.object().shape({
        cep: Yup.string().required(),
        address: Yup.string().required(),
        number: Yup.number().required(),
        complement: Yup.string().notRequired(),
        district: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().required(),
        main_adress: Yup.boolean().required(),
      });

      if (!(await schemaAddress.isValid(req.body))) {
        return res
          .status(400)
          .json({ error: "User address's validation fails" });
      }

      const { number, district, city, state, address } = req.body;
      const { access_token, country, base_url, geocoding } = mapboxConfig;

      const responseMapbox = await axios.get(
        `${base_url}${geocoding} ${address} ${district} ${city} ${state}.json`,
        {
          params: { access_token, country },
        }
      );

      let latitude = 0;
      let longitude = 0;
      let relevance = '';

      if (responseMapbox.data.features.length !== 0) {
        latitude = responseMapbox.data.features[0].center[1];
        longitude = responseMapbox.data.features[0].center[0];
        relevance = responseMapbox.data.features[0].relevance;
      }

      req.body.latitude = latitude;
      req.body.longitude = longitude;
      req.body.relevance = relevance;

      // console.log(req.body);
      transaction = await sequelizeInstance.connection.transaction();
      const user = await User.findByPk(req.userId, { transaction });

      const adressCreated = await Adress.create(req.body, { transaction });

      if (req.body.main_adress) {
        await UsersAdresses.update(
          {
            main_adress: false,
          },
          {
            where: {
              user_id: req.userId,
            },
            transaction,
          }
        );
      }

      await user.addAdresses(adressCreated, {
        through: { main_adress: req.body.main_adress },
        transaction,
      });

      await transaction.commit();

      const userAdress = await User.findByPk(req.userId, {
        attributes: ['id', 'name', 'last_name', 'telephone', 'email', 'role'],
        joinTableAttributes: ['main_adress', 'delivery_adress'],
        include: {
          association: 'adresses',
          attributes: [
            'id',
            'cep',
            'address',
            'number',
            'complement',
            'district',
            'city',
            'state',
          ],
          where: {
            id: adressCreated.id,
          },
          through: {
            attributes: ['main_adress', 'delivery_adress', 'active'],
            as: 'options',
          },
        },
      });

      return res.json(userAdress);
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      return res.status(400).json({
        error:
          'An unexpected error occurred, please contact system administrator! ',
      });
    }
  }

  async index(req, res) {
    const { address_id } = req.query;
    const adresses = await User.findByPk(req.userId, {
      where: { active: true },
      attributes: ['id', 'name', 'last_name', 'telephone', 'email', 'role'],
      include: {
        model: Adress,
        as: 'adresses',
        where: {
          id: address_id || { [Op.ne]: null },
        },
        order: ['updated_at', 'ASC'],
        attributes: [
          'id',
          'cep',
          'address',
          'number',
          'complement',
          'district',
          'city',
          'state',
          'updated_at',
        ],
        through: {
          attributes: ['main_adress', 'active'],
          as: 'options',
        },
      },
    });

    return res.json(adresses);
  }

  async update(req, res) {
    let transaction;
    try {
      const schemaAddress = Yup.object().shape({
        id: Yup.string().required(),
        number: Yup.number().required(),
        complement: Yup.string().notRequired(),
        main_adress: Yup.boolean().required(),
      });

      if (!(await schemaAddress.isValid(req.body))) {
        return res
          .status(400)
          .json({ error: "User address's validation fails" });
      }

      transaction = await sequelizeInstance.connection.transaction();
      const address = await UsersAdresses.findOne(
        {
          where: {
            adress_id: req.body.id,
            user_id: req.userId,
          },
        },
        { transaction }
      );

      if (!address) {
        return res.status(400).json({ error: 'No address was found!' });
      }

      await Adress.update(
        {
          number: req.body.number,
          complement: req.body.complement,
        },
        {
          where: {
            id: req.body.id,
          },
          transaction,
        }
      );

      console.log(typeof req.body.main_adress);
      console.log(req.body.main_adress);
      if (req.body.main_adress) {
        await UsersAdresses.update(
          {
            main_adress: false,
          },
          {
            where: {
              user_id: req.userId,
            },
            transaction,
          }
        );
      }

      await UsersAdresses.update(
        {
          main_adress: req.body.main_adress,
        },
        {
          where: {
            adress_id: req.body.id,
            user_id: req.userId,
          },
          transaction,
        }
      );

      await transaction.commit();

      const userAdress = await User.findByPk(req.userId, {
        attributes: ['id', 'name', 'last_name', 'telephone', 'email', 'role'],
        joinTableAttributes: ['main_adress', 'delivery_adress'],
        include: {
          association: 'adresses',
          attributes: [
            'id',
            'cep',
            'address',
            'number',
            'complement',
            'district',
            'city',
            'state',
          ],
          where: {
            id: req.body.id,
          },
          through: {
            attributes: ['main_adress', 'delivery_adress', 'active'],
            as: 'options',
          },
        },
      });

      return res.json(userAdress);
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

export default new UserAdressesController();
