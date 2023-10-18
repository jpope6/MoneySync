const express = require("express");
const router = express.Router();


var admin = require("firebase-admin");
const db = admin.firestore();
const Users = db.collection("users");


router.post("/add-bank", async (req, res) => {
    try {
        const { name, user_id } = req.body;

        const userRef = Users.doc(user_id);
        const banksRef = userRef.collection("banks").doc();

        const newBankData = {
            name: name
        };

        await banksRef.set(newBankData);

        res.status(201).json({ message: "Bank added successfully" });

    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});

router.get("/get-bank-names", async (req, res) => {
    try {
        const { user_id } = req.query;

        const userRef = Users.doc(user_id);
        const banksRef = userRef.collection("banks");
        const snapshot = await banksRef.get();
        const bankNames = snapshot.docs.map((doc) => doc.get("name"));;

        res.status(200).json({ bankNames });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});


module.exports = router;
