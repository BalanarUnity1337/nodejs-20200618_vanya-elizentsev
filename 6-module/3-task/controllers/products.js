const productModel = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.request.query;

  if (query) {
    const products = await productModel.find({$text: {$search: query}});

    ctx.response.status = 200;
    ctx.response.body = {
      products,
    };
  }
};
