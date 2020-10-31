module.exports = {
  up: (queryInterface) => {
    return queryInterface.renameColumn('users', 'employee', 'role');
  },

  down: (queryInterface) => {
    return queryInterface.renameColumn('users', 'role', 'employee');
  },
};
