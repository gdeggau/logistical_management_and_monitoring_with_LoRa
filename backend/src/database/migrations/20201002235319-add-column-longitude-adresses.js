module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('adresses', 'longitude', {
      type: Sequelize.DECIMAL(9, 6),
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('adresses', 'longitude');
  },
};
