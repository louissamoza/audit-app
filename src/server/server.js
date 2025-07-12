import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import auditRouter from './routes/audit.js';

const PORT = 8000;
const app = express();

app.use(express.json());

app.use("/api", auditRouter);

app.use(express.static(path.join(import.meta.dirname, '../client')));
app.use('/node_modules', express.static(path.join(import.meta.dirname, '../../node_modules')));

app.get('/', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../client/home.html'));
});

mongoose.connect('mongodb://127.0.0.1:27017/auditDB');
console.log("Connected to the database");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});