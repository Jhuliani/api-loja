'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(  req.body.name, 3, 'O titulo deve conter pelo menos 3 caracteres' );
    contract.isEmail(  req.body.email, 'Email inválido' );
    contract.hasMinLen(  req.body.password, 3, 'O titulo deve conter pelo menos 3 caracteres' );

    if (!contract.isValid()) {
      res.status(400).send(contract.errors()).end();
      return
    }
  
    try{
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        emailService.send(req.body.email, 'Bem vindo ao Node Store',
         global.EMAIL_TMPL.replace('{0}', req.body.name) );

        res.status(201).send({
            message: 'Cliente cadastrado com sucesso'
        });
    }catch (e) {
        res.status(500).send({
            message: 'Cliente cadastrado com sucesso!'
        });
    }
};