// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
const path = require('path');
const port = Number(process.env.PORT) || 3000;

app.use(express.static(path.join(__dirname, 'dist', 'FrontEnd')));

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/casestudy2';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);// Task2: create mongoDB connection 


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below
// Get all employees
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single employee
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        res.status(400).json({ message: 'Invalid employee ID or request' });
    }
});

// Add a new employee
app.post('/api/employeelist', async (req, res) => {
    try {
        const employee = await Employee.create({
            name: req.body.name,
            location: req.body.location,
            position: req.body.position,
            salary: req.body.salary
        });

        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an employee
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid employee ID or request' });
    }
});

// Update an employee
app.put('/api/employeelist', async (req, res) => {
    try {
        const id = req.body._id || req.body.id;

        if (!id) {
            return res.status(400).json({
                message: 'Employee ID is required for updating'
            });
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                location: req.body.location,
                position: req.body.position,
                salary: req.body.salary
            },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});






//TODO: get data from db  using api '/api/employeelist'




//TODO: get single data from db  using api '/api/employeelist/:id'





//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}






//TODO: delete a employee data from db by using api '/api/employeelist/:id'





//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'Frontend', 'index.html'));
});

const startServer = (listenPort) => {
    const server = app.listen(listenPort, () => {
        console.log(`Server running on port ${listenPort}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            const nextPort = listenPort + 1;
            console.warn(`Port ${listenPort} is in use. Trying ${nextPort} instead.`);
            startServer(nextPort);
            return;
        }

        throw err;
    });
};

startServer(port);

