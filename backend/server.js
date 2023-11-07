const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

var admin = require("firebase-admin");

var serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const corsOptions = {
    origin: ['https://money-sync.onrender.com', 'https://cloudy-crow-sunbonnet.cyclic.app', 'http://localhost:3000'],
    credentials:true,
    optionsSuccessStatus: 200,
};

app
    .use(express.json())
    .use(cors(corsOptions))
    .use("/api/users", require("./src/routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
