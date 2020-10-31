module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn(
          'cargos_orders',
          'pending_scan',
          'scanned',
          { transaction: t }
        ),
        // queryInterface.changeColumn(
        //   "cargos_orders",
        //   "scanned",
        //   {
        //     defaultValue: false,
        //   },
        //   { transaction: t }
        // ),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn(
          'cargos_orders',
          'scanned',
          'pending_scan',
          { transaction: t }
        ),
        // queryInterface.changeColumn(
        //   "cargos_orders",
        //   "pending_scan",
        //   {
        //     defaultValue: true,
        //   },
        //   { transaction: t }
        // ),
      ]);
    });
  },
};
