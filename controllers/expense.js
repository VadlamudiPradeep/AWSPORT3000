const Expense = require('../models/expenses');
const BlobServiceClient = require('@azure/storage-blob')
const  uuidv1  = require('uuid');
let fs = require('fs')

function isStringValid(string){
    if(string === undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}
const addExpense = (req, res) => {
    const { expenseamount, description, category } = req.body;
console.log('exp-amount :'+ expenseamount)
    if(isStringValid(expenseamount) || isStringValid(description) || isStringValid(category) ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    
    Expense.create({ expenseamount, description, category, userId: req.user.id}).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(500).json({success : false, error: err})
    })
}

const getExpense = (req, res)=> {
    
    Expense.findAll({ where : { userId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

const deleteExpense = (req, res) => {
    const expenseid = req.params.expenseid;
    if(isStringValid(expenseid)){
        return res.status(400).json({success: false, })
    }
    Expense.destroy({where: { id: expenseid, userId: req.user.id }}).then((noofrows) => {
        if(noofrows === 0){
            return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
        }
        return res.status(200).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: true, message: "Failed"})
    })
}

const downloadExpenses =  async (req, res) => {

    Expense.findAll({where: {userId:req.user.id}}).then(expenses=>{
        fs.writeFile("expenses.txt", JSON.stringify(expenses), (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              console.log(fs.readFileSync("expenses.txt", "utf8"));
            }
        });
        const file=`${__dirname}/expenses.txt`
        res.status(200).send(JSON.stringify(expenses))
    }).catch(err=>console.log(err))
};

// Pagination
var ITEMS_PER_PAGE=3
// exports.updatePages=(req,res,next)=>{
//   console.log(req.params.pages)
//   ITEMS_PER_PAGE=parseInt(req.params.pages)
//   res.status(200).send({updated:true})
// }

const Pagination=async(req, res, next)=>{
  var totalExpenses;
  let positive=0.00, negative=0.00;
  const page = +req.params.pageNo || 1;
  let totalItems=Expense.findAll({where: {userId: req.user.id}}).then(response=>{
      totalExpenses=response.length
      response.map(i=>{
          (i.amount>0)?positive+=i.amount:negative+=i.amount;
      })
  }).catch(err=>console.log(err))

  await totalItems;

  Expense.findAll({where: {userId: req.user.id}, offset: (page-1)*ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE})
  .then(response=>{
      res.status(200).send({
          response: response,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalExpenses,
          hasPreviousPage: page > 1,
          nextPage:page+1,
          previousPage:page-1,
          positive:positive,
          negative:negative,
          lastPage:Math.ceil(totalExpenses/ITEMS_PER_PAGE),
          totalItems: totalExpenses
      });
  })
}


module.exports = {
    deleteExpense,
    getExpense,
    addExpense,
    downloadExpenses,
    Pagination
}