const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dummy user data for login validation
const users = {
    'user@example.com': 'password123',
    'admin@example.com': 'admin456'
};

// Route for handling login
app.post('/api/login', (req, res) => {
    const { email, password, ip } = req.body;

    // Check if the credentials are correct
    if (users[email] && users[email] === password) {
        res.json({ success: true, message: 'Login successful', ip });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Route for VPN detection
app.post('/api/vpn-check', async (req, res) => {
    const { ip } = req.body;
    const apiKey = 'RmAjkqzxWBk0Qr721eo6KWsFXCspY6Km'; // Replace with your actual API key

    try {
        const response = await axios.get(`https://ipqualityscore.com/api/json/ip/${apiKey}/${ip}`);
        res.json({ vpn: response.data.vpn });
    } catch (error) {
        console.error('Error checking VPN status:', error);
        res.status(500).json({ error: 'Error checking VPN status' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
