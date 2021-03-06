module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('adresses', 'relevance', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('adresses', 'relevance');
  },
};
