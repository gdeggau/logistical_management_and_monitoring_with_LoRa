import Sequelize, { Model } from "sequelize";

import uuid from "uuid/v4";

class File extends Model {
  //o parametro sequelize é a conexão com o banco de dados
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeCreate", async (file) => {
      file.id = uuid();
    });

    return this;
  }
}

export default File;
