module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('adresses', 'latitude', {
      type: Sequelize.DECIMAL(9, 6),
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('adresses', 'latitude');
  },
};
