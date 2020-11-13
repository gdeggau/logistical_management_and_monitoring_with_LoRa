const { Sequelize } = require('sequelize');

module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.changeColumn('users', 'role', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.changeColumn('users', 'role', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },
};
