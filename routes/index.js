const express = require('express');
const router =	express.Router();

router.use('/users', require('./users'));
router.use('/tags', require('./tags'));
router.use('/pics', require('./pics'));
router.use('/notifs', require('./notifs'));
router.use('/locations', require('./locations'));
router.use('/chats', require('./chats'));

module.exports = router;
