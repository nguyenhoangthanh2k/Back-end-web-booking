module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.changeColumn('Users', 'image', {
        type: Sequelize.BLOB('long'),
        allowNull: true,
      });
  
    },
  
    down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn('Users', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  }