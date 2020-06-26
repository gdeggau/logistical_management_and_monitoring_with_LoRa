//para utilizar o 'import ... from ...' no Node.js é necessário configurar
// o Sucrase. Isso é apenas questão de gosto, no caso o Node
// utiliza a versão antiga de importar: 'const ... = require ..'
import express from "express";
import path from "path";
import routes from "./routes";
import "./database";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
