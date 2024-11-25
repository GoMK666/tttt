const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

// Replace with your Google Docs API credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'YOUR_REDIRECT_URI';
const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const docs = google.docs({ version: 'v1', auth: oauth2Client });
const DOCUMENT_ID = 'YOUR_DOCUMENT_ID';

app.post('/submit', async (req, res) => {
    const { name, email, phone, status } = req.body;

    // Logic to append data to Google Docs
    try {
        await docs.documents.batchUpdate({
            documentId: DOCUMENT_ID,
            resource: {
                requests: [
                    {
                        insertText: {
                            location: {
                                index: 1, // Adjust index as needed
                            },
                            text: `${name}, ${email}, ${phone}, ${status}\n`
                        }
                    }
                ]
            }
        });
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

app.get('/employees', async (req, res) => {
    // Logic to fetch data from Google Docs
    try {
        const response = await docs.documents.get({ documentId: DOCUMENT_ID });
        const content = response.data.body.content;

        // Parse content to extract employee data
        const employees = []; // Extracted employee data
        // Implement parsing logic here

        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});