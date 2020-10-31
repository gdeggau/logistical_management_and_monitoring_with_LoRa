// para utilizar o 'import ... from ...' no Node.js é necessário configurar
// o Sucrase. Isso é apenas questão de gosto, no caso o Node
// utiliza a versão antiga de importar: 'const ... = require ..'
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import localtunnel from 'localtunnel';
// importar o express-async-errors antes das rotas
import 'express-async-errors';
// import { format } from 'date-fns';
import './database';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import routes from './routes';
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
    // this.tunnel();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }

  async tunnel() {
    const tunnel = await localtunnel({ port: 3333, subdomain: 'deggautcc' });

    // the public url for your tunnel
    // https://sadgasg.localtunnel.me
    // tunnel.url;

    tunnel.on('request', (info) => {
      // console.log(format(new Date(), 'EEE MMM dd yyyy HH:mm:ss OOOO'), info);
    });
    tunnel.on('close', () => {
      // tunnels are closed
    });
  }
}

export default new App().server;
