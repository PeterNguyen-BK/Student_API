const Class = require('../models/class.model');
const Student = require('../models/student.model');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports.getClasses = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const classes = await Class.find().populate('student', 'name').exec();
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log(classes);
    const result = {
        page: page,
        limit: limit,
        totalRows: 0,
        classes: []
    };
    result.totalRows = classes.length;
    result.classes = classes.slice(startIndex, endIndex);
    res.json(result);
}

module.exports.createClass = async (req, res) => {
    const name = req.body.name;
    const CID = req.body.cid;
    const created_time = new Date(moment().format().split('+')[0]+'Z');
    const updated_time = new Date(moment().format().split('+')[0]+'Z');

    const newClass = new Class({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        CID: CID,
        created_at: created_time,
        updated_at: updated_time
    });

    newClass.save((err) => {
        if (err) console.log(err);
        res.json({message: "successfully!"});
    });
}

module.exports.updateClass = async (req,res) => {
    const classId = req.params.classid;
    const name = req.body.name;
    const CID = req.body.cid;
    const updated_time = new Date(moment().format().split('+')[0]+'Z');

    const classUpdate = await Class.findOne({ CID: classId }).exec();

    if (name) classUpdate.name = name;
    if (CID) classUpdate.CID = CID;

    classUpdate.updated_at = updated_time;
    classUpdate.save(err => {
        if (err) throw err;
        res.json({message: "Update Successfully!"});
    });
}

module.exports.deleteClass = async (req, res) => {
    const CID = req.params.classid;
    const classDelete = await Class.findOne({ CID: CID }).exec()
    Class.findOneAndRemove({ CID: CID }, (err) => {
        if (err) throw err;
        Student.updateMany(
            { "classes": classDelete._id },
            { "$pull": { "classes": classDelete._id } },
            (err) => {
                if (err) throw err;
                res.json({message: "Delete Successfully!"});
            }
        );
    });
}