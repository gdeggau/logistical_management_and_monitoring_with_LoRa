//para utilizar o 'import ... from ...' no Node.js é necessário configurar
// o Sucrase. Isso é apenas questão de gosto, no caso o Node
// utiliza a versão antiga de importar: 'const ... = require ..'
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
//importar o express-async-errors antes das rotas
import "express-async-errors";
import routes from "./routes";
import "./database";
import Youch from "youch";
import * as Sentry from "@sentry/node";
import sentryConfig from "./config/sentry";

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === "development") {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: "Internal server error" });
    });
  }
}

export default new App().server;
