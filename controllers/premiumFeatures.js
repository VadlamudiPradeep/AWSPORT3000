let User  = require('../models/users');
let Expense = require('../models/expenses');
const sequelize = require('../util/database');

let GetUserLeaderBoard =  async (req, res) => {
    try{
       
        const expenses = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost', 'DESC']]

        });
    return res.status(200).json(expenses)
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}


module.exports = {
    GetUserLeaderBoard
}