const Parent = require('../models/parent.model');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports.createParent = async (req, res) => {
    const name = req.body.name;
    const studentID = req.body.studentid ? parseInt(req.body.studentid) : null;
    const created_time = new Date(moment().format().split('+')[0]+'Z');
    const updated_time = new Date(moment().format().split('+')[0]+'Z');

    const newParent = new Parent({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        created_at: created_time,
        updated_at: updated_time,
        student: studentID
    });

    newParent.save((err) => {
        if (err) {
            console.error(err);
            res.json({message: "Failed!"});
        }
        else res.json({message: "successfully!"});
    });
}