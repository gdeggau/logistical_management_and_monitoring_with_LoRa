module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeConstraint(
      'products',
      'products_description_key'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('products', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
