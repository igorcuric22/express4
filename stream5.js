const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stream5.html'));
});

// Route to stream the MP4 video file
app.get('/stream-video', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'igor.mp4');

    // Get file stats (to determine file size)
    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error('Error getting file stats:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Set headers
        res.setHeader('Content-Type', 'video/mp4');
        //res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', stats.size);

        // Create read stream
        const readStream = fs.createReadStream(filePath, { highWaterMark: 1024 }); // 1KB chunks

        // Send data chunk by chunk
        readStream.on('data', (chunk) => {
            res.write(chunk);
            console.log(chunk);
            //const chunkString = chunk.toString('utf8');
            //res.write(chunkString);
            //console.log(chunkString);
        });

        // End the response when all data is sent
        readStream.on('end', () => {
            res.end();
        });

        // Handle stream errors
        readStream.on('error', (err) => {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
