var admin = require("firebase-admin");

var serviceAccount = require("../../finance-tracker-32961-firebase-adminsdk-memb8-c1c27ec389.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
