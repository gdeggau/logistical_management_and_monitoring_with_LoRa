import { format } from 'date-fns';
import LoraMessage from '../schemas/LoraMessage';

class LoraMessagesController {
  async store(req, res) {
    console.log('Data: ', format(new Date(), 'EEE MMM dd yyyy HH:mm:ss OOOO'));
    console.log('Params:', req.params);
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    //   console.log("Requisição completa:", req);
    console.log('Corpo da requisição:', req.body);
    console.log('recebeu');

    // Insere mensagem LoRa vindo da KORE no MongoDB
    await LoraMessage.create({
      type: req.body.type,
      params: req.body.params,
      meta: req.body.meta,
    });

    return res.end();
  }
}

export default new LoraMessagesController();
