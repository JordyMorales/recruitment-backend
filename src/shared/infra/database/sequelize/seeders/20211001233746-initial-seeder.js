const runner = require('../runner');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const USERS = () =>
      queryInterface.bulkInsert(
        'user',
        [
          {
            user_id: '52b65e08-cb03-4251-a674-3462e84cf843',
            first_name: 'Jordy',
            last_name: 'Morales',
            email: 'dev.morales.jordy@gmail.com',
            role: 'ADMIN',
            state: 'ACTIVE',
          },
        ],
        {},
      );

    await runner.run([() => USERS()]);
  },

  down: async (queryInterface, Sequelize) => {
    await runner.run([() => queryInterface.bulkDelete('user')]);
  },
};
