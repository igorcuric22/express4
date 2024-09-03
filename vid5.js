const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const DIRECTORY="uploads10";

// Create 'uploads1' directory if it doesn't exist
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vid5.html'));
});

let CHUNK_NUMBER = 0;

// Handle file upload
app.post('/upload', (req, res) => {
    const fileName = `video_${++CHUNK_NUMBER}.webm`;
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
