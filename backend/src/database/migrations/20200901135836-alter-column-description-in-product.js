module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeConstraint(
      'products',
      'products_description_key'
    );
  },

  down: (queryInterface) => {
    return queryInterface.changeColumn('products', 'description', {
      unique: true,
    });
  },
};
