const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {type: String, index: { unique: true } },
    CID: String,
    created_at: Date,
    updated_at: Date,
    students: [{type: Number, ref: 'Student'}]
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;