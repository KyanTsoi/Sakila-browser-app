var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const model =  { title: 'Sakila movie list' }
  const view = 'index'
  res.render(view, model);
});

router.get('/about', function(req, res, next) {
  const model = { title: 'About this App' }
  const view = 'about'
  res.render(view, model);
});

module.exports = router;
