const express = require('express');
const router = express.Router();
const controller = require('../controllers/class.controller');

router.route('/')
    .get(controller.getClasses)
    .post(controller.createClass);

router.route('/:classid')
    .put(controller.updateClass)
    .delete(controller.deleteClass);

module.exports = router;