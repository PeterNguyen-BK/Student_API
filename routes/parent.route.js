const express = require('express');
const router = express.Router();
const controller = require('../controllers/parent.controller');

router.route('/')
    .get(controller.getParents)
    .post(controller.createParent);

router.route('/:parentid')
    .put(controller.updateParent)
    .delete(controller.deleteParent);

module.exports = router;