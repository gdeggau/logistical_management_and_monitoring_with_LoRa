"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("users", "employee", "role");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("users", "role", "employee");
  },
};
