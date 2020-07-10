const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');

const categoryModel = require('./models/Category');
const productModel = require('./models/Product');

// productModel.create({
//   title: 'Product1',
//   description: 'Description1',
//   price: 10,
//   category: '5f07479c937073409cc25e1b',
//   subcategory: '5f07479c937073409cc25e1c',
//   images: ['image1'],
// });

// categoryModel.create({
//   title: 'Category1',
//   subcategories: [{
//     title: 'Subcategory1',
//   }],
// });

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

app.use(router.routes());

module.exports = app;
