const path = require('path');
const fs = require('fs') ;

const express = require('express');
const app = express();
var cors = require('cors')
const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/ForgotPassword');
const morgan = require('morgan');

const accessLogStream 
= fs.createWriteStream(path.join(__dirname, 'access.log'),
{flags : 'a'});
// Impoet helmet
const helmet=require('helmet')
app.use(helmet())

app.use(morgan('combined' , {stream : accessLogStream}))
require('dotenv').config();

const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeaturesRoutes = require('./routes/premiumFeatures');
const ForgetPasswordRouter = require('./routes/resetpassword');



const dotenv = require('dotenv');

// get config vars
dotenv.config();


app.use(cors());

// app.use(bodyParser.urlencoded());  ////this is for handling forms
app.use(express.json());  //this is for handling jsons

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/user', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium' , premiumFeaturesRoutes)
app.use('/password' , ForgetPasswordRouter);

app.use((req ,res)=>{
    console.log('url' , req.originalUrl)
    res.sendFile(path.join(__dirname,`frontend/${req.url}`));
});


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    })