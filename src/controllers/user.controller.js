// user.controller.js
const userService = require('../services/user.service');

exports.getUser = (req, res, next) => {
  const userId = req.params.id;

  userService.getUserById(userId, (err, user) => {
    if (err) {
      next({ error: err.message });
    } else {
      const model = user;
      const view = "user.details"
      res.render(view, model);
    }
  });
};
