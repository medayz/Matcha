const express = require('express');
const router = express.Router();
const auth = require('../middlewares/checkToken');

router.use('/users', require('./users'));
router.use('/tags', require('./tags'));
router.use('/pics', require('./pics'));
router.use('/notifs', auth, require('./notifs'));
router.use('/locations', auth, require('./locations'));
router.use('/chats', auth, require('./chats'));

module.exports = router;