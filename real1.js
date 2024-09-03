const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

const DIRECTORY = "uploads";
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIRECTORY);
    },
    filename: (req, file, cb) => {
        const { name, chunk } = req.body;
        const filename = `${name}_${chunk}.webm`;
        console.log(`Saving file: ${filename}`); // Log file save
        cb(null, filename);
    }
});
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'real1.html'));
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log(`Uploaded chunk: ${req.body.chunk} for stream: ${req.body.name}`);
    res.sendStatus(200);
});

app.get('/api/download', (req, res) => {
    const { name, chunk } = req.query;
    const filePath = path.join(__dirname, DIRECTORY, `${name}_${chunk}.webm`);
    console.log(`Fetching file: ${filePath}`); // Log file fetch

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.log(`File not found: ${filePath}`); // Log file not found
        res.status(404).send('File not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
