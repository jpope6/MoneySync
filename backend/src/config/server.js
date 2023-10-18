const express = require("express");
const app = express();
const cors = require("cors");

var admin = require("firebase-admin");

var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app
    .use(express.json())
    .use(cors())
    .use("/api/users", require("../routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
