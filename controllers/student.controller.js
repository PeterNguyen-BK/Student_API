const Student = require('../models/student.model');
const Class = require('../models/class.model');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports.getStudents = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const time_created = req.query.timeCreated ? new Date(req.query.timeCreated + ' 23:59:00Z') : '';
    const time_updated = req.query.timeUpdated ? new Date(req.query.timeUpdated + ' 23:59:00Z') : '';
    const classFilter = req.query.class;
    const sortBy = req.query.sort_by;
    const orderBy = parseInt(req.query.order_by);
    const numOfParent = parseInt(req.query.parentQuantity);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const result = {
        page: page,
        limit: limit,
        totalRows: 0,
        students: []
    };
    let students;
    if (time_created) { 
        if (sortBy) students = await Student.find({ created_at: { $lte: time_created } }).populate('classes', 'name', 'CID').sort({ [sortBy]: orderBy }).exec();
        else students = await Student.find({ created_at: { $lte: time_created } }).populate('classes', 'name').exec();
        result.totalRows = students.length;
        result.students = students.slice(startIndex, endIndex);
    } else if (time_updated) {
        if (sortBy) students = await Student.find({ updated_at: { $lte: time_updated } }).populate('classes', 'name', 'CID').sort({ [sortBy]: orderBy }).exec();
        else students = await Student.find({ updated_at: { $lte: time_updated } }).populate('classes', 'name').exec();
        
        result.totalRows = students.length;
        result.students = students.slice(startIndex, endIndex);
    } else if (classFilter) {
        if (sortBy)
            students = await Student.find().populate({
                path: 'classes',
                match: { CID: classFilter },
                select: 'name-_id'
            }).sort({ [sortBy]: orderBy }).exec();
        else 
            students = await Student.find().populate({
                path: 'classes',
                match: { CID: classFilter },
                select: 'name-_id'
            }).exec();
        
        result.totalRows = students.length;
        result.students = students.slice(startIndex, endIndex);
    }
    else if (numOfParent) {
        students = await Student.aggregate([
            { $unwind: "$classes" },
            {
                $lookup: {
                    from: "parents",
                    localField: "_id",
                    foreignField: "student",
                    as: "parents"
                }
            },
            { $project: 
                { name: 1, dateOfBirth: 1, parents: { $size: "$parents" } }
            },
            { $match: { parents: numOfParent } },

        ]).exec();
        result.totalRows = students.length;
        result.students = students.slice(startIndex, endIndex);
    }else {
        if (sortBy) students = await Student.find().populate('classes', 'name', 'CID').sort({ [sortBy]: orderBy }).exec();
        else students = await Student.find().populate('classes', 'name').exec();
        
        result.totalRows = students.length;
        result.students = students.slice(startIndex, endIndex);
    }
    res.json(result);
}

module.exports.getDetailStudent = async (req,res) => {
    const studentId = parseInt(req.params.studentid);
    student = await Student.findOne({ _id: studentId }).populate('classes', 'name', 'CID').exec();
    res.json(student);
}

module.exports.createStudent = async (req, res) => {
    const name = req.body.name;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const studentClass = req.body.class;
    const created_time = new Date(moment().format().split('+')[0]+'Z');
    const updated_time = new Date(moment().format().split('+')[0]+'Z');

    const assignClass = await Class.findOne({ CID: studentClass }).exec();

    const classID = (assignClass != null) ? [assignClass._id] : [];
    // console.log(assignClass);

    let sid = 1;
    const lastStudent = await Student.findOne().sort({ created_at: -1 });
    if (lastStudent) sid = lastStudent._id + 1; 

    const student = new Student({
        _id: sid,
        name: name,
        dateOfBirth: dob,
        gender: gender,
        created_at: created_time,
        updated_at: updated_time,
        classes: classID
    });


    student.save((err) => {
        if (err) {
            throw err;
        }
        else if (assignClass != null) {
            assignClass.students.push(student._id);
            assignClass.save(err => {
                if (err) {
                    throw err;
                }
            });
        }
        
        res.json({message: "Successfully!"});
    });
}

module.exports.updateStudent = async (req,res) => {
    const studentId = req.params.studentid;
    const name = req.body.name;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const addClass = req.body.classAdd;
    const deleteClass = req.body.classDelete;
    const updated_time = new Date(moment().format().split('+')[0]+'Z');
    const student = await Student.findOne({ _id: studentId }).exec();
    if (name) student.name = name;
    if (dob) student.dob = dob;
    if (gender) student.gender = gender;
    if (addClass) {
        const assignClass = await Class.findOne({ CID: addClass }).exec();

        if (assignClass != null) {
            student.classes.push(assignClass._id);
            assignClass.students.push(student._id);
            assignClass.save(err => {
                if (err) {
                    throw err;
                }
            });
        }
    }
    if (deleteClass) {
        const assignClass = await Class.findOne({ CID: deleteClass }).exec();
        const idx = student.classes.indexOf(assignClass._id);
        student.classes.splice(idx, 1);
        Class.updateOne(
            { "students": studentId },
            { "$pull": { "students": studentId } },
            (err) => {
                if (err) throw err;
            }
        );
    }
    student.updated_at = updated_time;
    student.save(err => {
        if (err) throw err;
        res.json({message: "Update Successfully!"});
    });
}

module.exports.deleteStudent = async (req, res) => {
    const studentId = req.params.studentid;

    Student.findOneAndRemove({ _id: studentId }, (err) => {
        if (err) throw err;
        Class.updateOne(
            { "students": studentId },
            { "$pull": { "students": studentId } },
            (err) => {
                if (err) throw err;
                res.json({message: "Delete Successfully!"});
            }
        );
    });
}

