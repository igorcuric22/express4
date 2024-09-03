const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const DIRECTORY="uu2";
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

// Middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/receiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chunk3.html'));
});


app.get('/download/:filename', (req, res) => {
    const chunkNumber = req.query.chunk;
    const chunkPath = path.join(__dirname, DIRECTORY, req.params.filename);
    console.log(chunkNumber);
    console.log(chunkPath);

    if (fs.existsSync(chunkPath)) {
        res.sendFile(chunkPath);
    } else {
        res.status(404).send('no such file');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
