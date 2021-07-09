const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    dateOfBirth: String,
    gender: String,
    created_at: { type: Date, index: true },
    updated_at: { type: Date, index: true },
    classes: [{ type: mongoose.Types.ObjectId, ref: 'Class', index: true }]
});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;