const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// create user table - expense
const User = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    expenseamount: Sequelize.INTEGER,
    category: Sequelize.STRING,
    description: Sequelize.STRING,
   
})

module.exports = User;
