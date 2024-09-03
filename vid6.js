const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const DIRECTORY="uploads12";

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
    res.sendFile(path.join(__dirname, 'public', 'vid6.html'));
});

let CHUNK_NUMBER = 0;

// Handle file upload


app.post('/upload', (req, res) => {
    const fileName = `example_${CHUNK_NUMBER++}.webm`;
    const filePath = path.join(__dirname, DIRECTORY, fileName);

    const data = [];
    req.on('data', chunk => {
        data.push(chunk);
    }).on('end', () => {
        const buffer = Buffer.concat(data);
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                return res.status(500).send('Failed to upload video');
            }
            res.send('Video uploaded successfully!');
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
