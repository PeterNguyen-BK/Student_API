const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, text: true },
    dateOfBirth: String,
    gender: String,
    SID: Number,
    created_at: { type: Date, index: true },
    updated_at: { type: Date, index: true },
    classes: [{ type: mongoose.Types.ObjectId, ref: 'Class', index: true }]
});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;