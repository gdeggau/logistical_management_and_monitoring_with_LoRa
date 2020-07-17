"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("cargos", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      cargo_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      plan_delivery_date_leave: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      plan_delivery_date_return: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      delivery_date_leave: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      delivery_date_return: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      driver_id: {
        type: Sequelize.UUID,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true,
      },
      vehicle_id: {
        type: Sequelize.UUID,
        references: { model: "vehicles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      observation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("cargos");
  },
};
