import User from '../models/User';
import File from '../models/File';

class DriverController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { role: 'DRIVER' },
      attributes: [
        'id',
        'name',
        'last_name',
        'telephone',
        'email',
        'avatar_id',
      ],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    return res.json(providers);
  }
}

export default new DriverController();
