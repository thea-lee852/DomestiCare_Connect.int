const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload-audio', upload.single('audioFile'), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);

    exec(`python3 /Users/thealee/Desktop/NEWLAW/whisper/transcribe.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: 'Failed to transcribe audio' });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: 'Failed to transcribe audio' });
        }

        const transcription = stdout.trim();
        res.json({ transcription });

        fs.unlinkSync(filePath); // Clean up the uploaded file
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});