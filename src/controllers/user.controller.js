// user.controller.js
const userService = require('../services/user.service');

function getUser(req, res, next){
  const userId = req.params.id;
console.log(`[Controller] Op zoek naar gebruiker met ID: ${userId} (type: ${typeof userId})`);

  userService.getUserById(userId, (err, user) => {
    if (err) {
      next({ error: err.message });
    } else {
      const model =  { user: user };
      const view = "user/details"
      res.render(view, model);
    }
  });
};

module.exports = { getUser };