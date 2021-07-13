const Parent = require('../models/parent.model');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports.getParents = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = {
        page: page,
        limit: limit,
        totalRows: 0,
        parents: []
    };
    const parents = await Parent.aggregate([
        {
            $lookup: {
                from: "students",
                let: { studentID: "$student" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$SID", "$$studentID"] } } },
                    { $project: { _id: 0, name: '$name', dateOfBirth: "$dateOfBirth", classes: "$classes" } }
                ],
                as: "student"
            },
        },
        { $project: { _id: 0 } }
    ]).exec();
    result.totalRows = parents.length;
    result.parents = parents.slice(startIndex, endIndex);
    res.json(result);
}

module.exports.createParent = async (req, res) => {
    const name = req.body.name;
    const studentID = req.body.studentid ? parseInt(req.body.studentid) : null;
    const created_time = new Date(moment().format().split('+')[0]+'Z');
    const updated_time = new Date(moment().format().split('+')[0]+'Z');

    let pid = 1;
    const lastParent = await Parent.findOne().sort({ created_at: -1 });
    if (lastParent) pid = lastParent.PID + 1; 

    const newParent = new Parent({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        PID: pid,
        created_at: created_time,
        updated_at: updated_time,
        student: studentID
    });

    newParent.save((err) => {
        if (err) {
            throw err;
        }
        res.json({message: "successfully!"});
    });
}

module.exports.updateParent = async (req, res) => {
    const parentId = req.params.parentid;
    const name = req.body.name;
    const student = req.body.student;
    const updated_time = new Date(moment().format().split('+')[0]+'Z');

    const parentUpdate = await Parent.findOne({ PID: parentId }).exec();

    if (name) parentUpdate.name = name;
    if (student) parentUpdate.student = parseInt(student);

    parentUpdate.updated_at = updated_time;
    parentUpdate.save(err => {
        if (err) throw err;
        res.json({message: "Update Successfully!"});
    });
}

module.exports.deleteParent = async (req, res) => {
    const parentId = req.params.parentid;
    Parent.deleteOne({ PID: parentId }, (err) => {
        if (err) throw err;
        res.json({message: "Delete Successfully!"});
    })
}