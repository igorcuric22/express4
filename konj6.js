const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const DIRECTORY="uu2";

// Create 'uploads4' directory if it doesn't exist
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

// Middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'konj6.html'));
});

app.get('/receiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'konjx6.html'));
});



app.post('/upload/:filename', (req, res) => {
    const data = [];
    req.on('data', chunk => {
        data.push(chunk);
    }).on('end', () => {
        const buffer = Buffer.concat(data);
        const filePath = path.join(__dirname,DIRECTORY, req.params.filename);
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                return res.status(500).send('Failed to upload video');
            }
            res.send('Video uploaded successfully!');
        });
    });
});

app.get('/download/:filename', (req, res) => {
    const chunkNumber = req.query.chunk;
    const chunkPath = path.join(__dirname, DIRECTORY, req.params.filename);

    if (fs.existsSync(chunkPath)) {
        res.sendFile(chunkPath);
    } else {
        res.status(404).send('no such file');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
