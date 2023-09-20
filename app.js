const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();


app.use(bodyParser.json());
app.use(express.static('frontend'));

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password')
const resetpasswordRoutes = require('./routes/resetpassword')

app.use('/user', userRoutes);
app.use('/exp', expenseRoutes);
app.use('/payment', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);
app.use('/resetpassword', resetpasswordRoutes);


mongoose
  .connect(
    'mongodb+srv://nishant9:Nishant9@cluster0.lt3ez0q.mongodb.net/shop?retryWrites=true'
  )
  .then(() => {
    app.listen(3000, () => {
      console.log('App started');
    });
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });