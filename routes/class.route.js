const express = require('express');
const router = express.Router();
const controller = require('../controllers/class.controller');

router.get('/', controller.getClasses);

router.post('/', controller.createClass);

router.put('/:classid', controller.updateClass);

router.delete('/:classid', controller.deleteClass);

module.exports = router;