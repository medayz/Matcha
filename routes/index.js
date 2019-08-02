const express = require('express');
const router = express.Router();
const auth = require('../middlewares/checkToken');

router.use('/users', auth, require('./users'));
router.use('/tags', auth, require('./tags'));
router.use('/pics', auth, require('./pics'));
router.use('/notifs', auth, require('./notifs'));
router.use('/locations', auth, require('./locations'));
router.use('/chats', auth, require('./chats'));

module.exports = router;