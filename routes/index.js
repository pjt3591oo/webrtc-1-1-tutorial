var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  return res.render('enter');
});

router.get('/meeting/:roomId', (req, res) => {
  const { roomId } = req.params;
  return res.render('meeting', { roomId });
})

module.exports = router;
