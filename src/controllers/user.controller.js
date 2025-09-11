// user.controller.js
const userService = require('../services/user.service');
const logger = require('../util/logger');

function getUser(req, res, next){
  const userId = req.params.id;

logger.debug(`[Controller] Op zoek naar gebruiker met ID: ${userId} (type: ${typeof userId})`);

  userService.getUserById(userId, (err, user) => {
    if (err) {
      next({ error: err.message });
      logger.error(`Fout bij ophalen gebruiker ${userId}:`, err.message);
    } else {
      const model =  { user: user };
      const view = "user/details"
      res.render(view, model);
    }
  });
};

module.exports = { getUser };