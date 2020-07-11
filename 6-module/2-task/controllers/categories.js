const categoryModel = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await categoryModel.find({});

  ctx.response.status = 200;
  ctx.response.body = {
    categories,
  };
};
