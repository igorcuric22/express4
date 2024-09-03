const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const DIRECTORY="uploads10";

// Create 'uploads4' directory if it doesn't exist
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

// Middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/receiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chunk2.html'));
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
