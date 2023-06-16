'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');

exports.get = async (req, res, next) => {
  try {
    let data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    let data = await repository.getBySlug(req.params.slug);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    let data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
};

exports.getByTag = async (req, res, next) => {
  try {
    const data = await repository.getByTag(req.params.tag).then((data) => {
      res.status(200).send(data);
    });
  } catch (e) {
    res.status(400).send({
      message: 'Falha ao processar sua requisição'
    });
  }
};

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(
    req.body.title,
    3,
    'O titulo deve conter pelo menos 3 caracteres'
  );
  contract.hasMinLen(
    req.body.slug,
    3,
    'O titulo deve conter pelo menos 3 caracteres'
  );
  contract.hasMinLen(
    req.body.description,
    3,
    'O titulo deve conter pelo menos 3 caracteres'
  );

  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
  }

  //se os dados forem invalidos
  if (contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }

  try {

    //Cria o blob service
    const blobSvc = azure.createBlobService(config.userImagesBlobConnectionString);

    let filename = guid.raw().toString() + '.jpg';
    let rwdata = req.body.image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    //Salva a imagem
    await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
      contentType: type
    }, function (error, result, response){
      if(error) {
        filename = 'default-product.png'
      }
    });
    
    await repository.create(req.body);
    res.status(201).send({
      message: 'Produto cadastrado com sucesso!'
    });
  } catch {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
};

//   let product = new Product(req.body);
//   product
//     .save()
//     .then((x) => {
//       res.status(201).send({
//         message: "Produto cadastrado com sucesso",
//       });
//     })
//     .catch((e) => {
//       res.status(400).send({
//         message: "Falha ao cadastrar",
//         data: e,
//       });
//     });
// };

exports.put = async (req, res, next) => {
  try {
    await repository.update(req.params.id, req.body);
    res.status(201).send({
      message: 'Produto atualizado com sucesso!'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao cadastrar'
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await repository.delete(req.body.id).then((x) => {
      res.status(201).send({
        message: 'Produto removido com sucesso!'
      });
    });
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao cadastrar'
    });
  }
};

// exports.put = async(req, res, next) => {
//   let id = req.params.id;
//   res.status(201).send({
//     id: id,
//     item: req.body,
//   });
// };

// exports.delete = (req, res, next) => {
//   res.status(200).send(req.body);
// };
