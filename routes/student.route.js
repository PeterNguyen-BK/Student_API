const express = require('express');
const router = express.Router();
const controller = require('../controllers/student.controller');

router.route('/')
    .get(controller.getStudents)
    .post(controller.createStudent);

router.route('/:studentid')
    .get(controller.getDetailStudent)
    .put(controller.updateStudent)
    .delete(controller.deleteStudent);

module.exports = router;

// repository, text index