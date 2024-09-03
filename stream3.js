const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const DIRECTORY = "uploads9";

// Create 'uploads4' directory if it doesn't exist
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the HTML files
app.get('/sender', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sender3.html'));
});

app.get('/receiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'receiver3.html'));
});

let CHUNK_NUMBER = 0;

// Handle file upload
app.post('/upload', (req, res) => {
    const fileName = `video_${CHUNK_NUMBER++}.webm`;
    const filePath = path.join(__dirname, DIRECTORY, fileName);

    const fileStream = fs.createWriteStream(filePath);
    req.on('data', chunk => {
        fileStream.write(chunk);
    });
    req.on('end', () => {
        fileStream.end();
        console.log('File uploaded successfully');
        res.status(200).send('File uploaded successfully');
    });
    req.on('error', err => {
        console.error('Error uploading file', err);
        res.status(500).send('Error uploading file');
    });
});

// Serve video chunks
app.get('/chunks/:filename', (req, res) => {
    const filePath = path.join(__dirname, DIRECTORY, req.params.filename);
    console.log(req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
