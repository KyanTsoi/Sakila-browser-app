var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const model =  { title: 'Express' }
  const view = 'index'
  res.render(view, model);
});

module.exports = router;
