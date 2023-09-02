var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
  return res.send(req.context.models.users[req.context.me.id]);
});

module.exports = router;