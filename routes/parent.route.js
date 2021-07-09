const express = require('express');
const router = express.Router();
const controller = require('../controllers/parent.controller');

router

router.post('/', controller.createParent);

module.exports = router;