// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const app = express();
// const bodyParser = require('body-parser');

// // Create 'uploads1' directory if it doesn't exist
// if (!fs.existsSync('uploads5')) {
//     fs.mkdirSync('uploads5');
// }

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // Serve the HTML files
// app.get('/sender', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'sender1.html'));
// });

// app.get('/receiver', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'receiver1.html'));
// });

// // Parse incoming form data
// app.use(bodyParser.raw({ type: 'video/webm', limit: '50mb' }));

// let chunkIndex = 0;

// // Handle file upload
// app.post('/upload', (req, res) => {
//     const fileName = `video_${chunkIndex++}.webm`;
//     const filePath = path.join(__dirname, 'uploads5', fileName);

//     fs.writeFile(filePath, req.body, (err) => {
//         if (err) {
//             console.error('Error saving chunk', err);
//             return res.status(500).send('Error saving chunk');
//         }

//         console.log('Chunk uploaded successfully');
//         res.status(200).send('Chunk uploaded successfully');
//     });
// });

// // Serve video chunks
// app.get('/chunks/:filename', (req, res) => {
//     const filePath = path.join(__dirname, 'uploads1', req.params.filename);
//     res.sendFile(filePath);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const DIRECTORY = "uploads6";

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
    res.sendFile(path.join(__dirname, 'public', 'sender1.html'));
});

app.get('/receiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'receiver1.html'));
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

// Serve video chunks
app.get('/chunks/:filename', (req, res) => {
    const filePath = path.join(__dirname, DIRECTORY, req.params.filename);
    res.sendFile(filePath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
