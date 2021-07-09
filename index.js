require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const studentRoute = require('./routes/student.route');
const classRoute = require('./routes/class.route');
const parentRoute = require('./routes/parent.route');
const cookieParser = require('cookie-parser');


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use('/students', studentRoute);
app.use('/classes', classRoute);
app.use('/parents', parentRoute);

app.listen(5000, () => {
    console.log('Server is running...');
});