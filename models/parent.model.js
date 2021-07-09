const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    created_at: Date,
    updated_at: Date,
    student: Number
});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;