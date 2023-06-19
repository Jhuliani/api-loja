'use strict';

const mongoose = require('mongoose');
const product = require('../models/product');
const Customer = mongoose.model('Customer');

exports.create = async(data) => {
  let customer = new Customer(data);
  await customer.save();
};

exports.authenticate = async(data) => {
  const res = await product.findOne({
    email: data.email, password: data.password
  });
  return res;
}
