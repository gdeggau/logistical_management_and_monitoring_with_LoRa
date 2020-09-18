"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      "products",
      "products_description_key"
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("products", "description", {
      unique: true,
    });
  },
};
