// const express = require('express');
// const path = require('path');
// const fs = require('fs');

// const app = express();

// // Create 'uploads1' directory if it doesn't exist
// const uploadsDir = path.join(__dirname, 'uploads2');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir);
// }

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'vid4.html'));
// });

// let CHUNK_NUMBER = 0;

// // Handle file upload
// app.post('/upload', (req, res) => {
//     const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
//     let rawData = '';

//     req.on('data', (chunk) => {
//         rawData += chunk.toString();
//     });

//     req.on('end', () => {
//         const parts = rawData.split('--' + boundary);
//         parts.forEach(part => {
//             if (part.indexOf('Content-Disposition') !== -1) {
//                 const subParts = part.split('\r\n\r\n');
//                 const headers = subParts[0];
//                 const body = subParts[1].substring(0, subParts[1].length - 2);

//                 if (headers.includes('filename')) {
//                     CHUNK_NUMBER++;
//                     const filename = `video_${CHUNK_NUMBER}.webm`;
//                     const filepath = path.join(uploadsDir, filename);

//                     fs.writeFile(filepath, body, 'binary', (err) => {
//                         if (err) {
//                             console.error('Error saving file:', err);
//                             res.status(500).send('Error saving file');
//                             return;
//                         }
//                         console.log('File uploaded successfully');
//                     });
//                 }
//             }
//         });
//         res.status(200).send('File uploaded successfully');
//     });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Create 'uploads1' directory if it doesn't exist
if (!fs.existsSync('uploads3')) {
    fs.mkdirSync('uploads3');
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vid4.html'));
});

let CHUNK_NUMBER = 0;

// Handle file upload
app.post('/upload', (req, res) => {
    const fileName = `video_${++CHUNK_NUMBER}.webm`;
    const filePath = path.join(__dirname, 'uploads3', fileName);

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
