const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, index: true },
    PID: Number,
    created_at: { type: Date, index: true },
    updated_at: Date,
    student: Number
});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;