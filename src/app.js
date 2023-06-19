'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//conecta ao banco
mongoose.connect(config.connectionString);

//carrega os models
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

//carrega as rotas
const indexRoutes = require('./routes/index-route');
const product = require('./routes/product-route');
const customer = require('./routes/customer-route');
const order = require('./routes/order-route');


app.use('/', indexRoutes);
app.use('/products', product);
app.use('/customers', customer);
app.use('/orders', order);

module.exports = app;
 