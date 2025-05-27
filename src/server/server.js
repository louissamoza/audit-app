import express from 'express';
import path from 'path';

const PORT = 8000;
const app = express();

app.use(express.json());

app.use(express.static(path.join(import.meta.dirname, '../client')));
app.use('/node_modules', express.static(path.join(import.meta.dirname, '../../node_modules')));

app.get('/', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../client/home.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});