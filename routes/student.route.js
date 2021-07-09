const express = require('express');
const router = express.Router();
const controller = require('../controllers/student.controller');

router.get('/', controller.getStudents);

router.get('/:studentid', controller.getDetailStudent);

router.post('/', controller.createStudent);

router.put('/:studentid', controller.updateStudent);

router.delete('/:studentid', controller.deleteStudent);

module.exports = router;