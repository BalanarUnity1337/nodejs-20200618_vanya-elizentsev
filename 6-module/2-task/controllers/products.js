const mongoose = require('mongoose');
const productModel = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (mongoose.Types.ObjectId.isValid(ctx.query.subcategory)) {
    const products = await productModel.find({subcategory: ctx.query.subcategory});

    ctx.response.status = 200;
    ctx.response.body = {
      products,
    };
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await productModel.find({});

  ctx.response.body = {
    products,
  };
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.request.url.split('/').pop();

  if (mongoose.Types.ObjectId.isValid(id)) {
    const product = await productModel.findOne({_id: id});

    if (product) {
      ctx.response.status = 200;
      ctx.response.body = {
        product,
      };
    } else {
      ctx.throw(404);
    }
  } else {
    ctx.throw(400);
  }
};

