const express = require('express');
const multer = require('multer');
const path = require('path');
const fs=require('fs');
const app = express();

// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploadx1')) {
    fs.mkdirSync('uploadx1');
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON bodies (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vid3.html'));
});

CHUNK_NUMBER=0;

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads1/');
    },
    filename: function(req, file, cb) {
        CHUNK_NUMBER++;
        cb(null, `video_${CHUNK_NUMBER}.webm`);
    }
});

const upload = multer({ storage: storage });

// Handle file upload
app.post('/upload', upload.single('video'), (req, res) => {
    console.log('File uploaded successfully');
    res.status(200).send('File uploaded successfully');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
