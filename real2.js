const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const DIRECTORY = "uploads";
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'real1.html'));
});

app.post('/api/upload', (req, res) => {
    let fileName;
    let fileBuffer = [];

    req.on('data', chunk => {
        fileBuffer.push(chunk);
    });

    req.on('end', () => {
        fileBuffer = Buffer.concat(fileBuffer);
        const { name, chunk } = req.query;  // Assuming filename parameters are sent in the query string

        if (!name || !chunk) {
            return res.status(400).send('Missing name or chunk parameters');
        }

        fileName = `${name}_${chunk}.webm`;
        const filePath = path.join(__dirname, DIRECTORY, fileName);

        fs.writeFile(filePath, fileBuffer, (err) => {
            if (err) {
                console.error(`Error saving file: ${fileName}`, err);
                return res.status(500).send('Failed to upload video');
            }
            console.log(`Uploaded chunk: ${chunk} for stream: ${name}`);
            res.send('Video uploaded successfully!');
        });
    });

    req.on('error', (err) => {
        console.error('Error during file upload', err);
        res.status(500).send('File upload failed');
    });
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
