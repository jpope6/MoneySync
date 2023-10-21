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
        const bankNames = snapshot.docs.map((doc) => doc.get("name"));

        res.status(200).json({ bankNames });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});

router.post("/add-bank-entry", async (req, res) => {
    try {
        const { user_id, bankName, date, checkingsAmt, savingsAmt, otherAmt } = req.body;

        const userRef = Users.doc(user_id);
        const banksRef = userRef.collection("banks");
        const bankQuery = banksRef.where("name", "==", bankName);

        bankQuery.get()
            .then(async (snapshot) => {
                if (!snapshot.empty) {
                    const bankDoc = snapshot.docs[0];

                    const newEntry = {
                        date,
                        checkings: checkingsAmt,
                        savings: savingsAmt,
                        other: otherAmt,
                    };

                    await bankDoc.ref.collection("entries").add(newEntry);
                    res.status(201).json({ message: "Entry added successfully" });
                } else {
                    res.status(404).json({ error: "Bank not found" });
                }
            })
            .catch((e) => {
                console.error(e.message);
                res.status(500).json({ error: "Server error." });
            })

    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});


router.delete("/delete-bank-entries", async (req, res) => {
    try {

        const { user_id, bankName, entriesToDelete } = req.body;

        const userRef = Users.doc(user_id);
        const banksRef = userRef.collection("banks");
        const bankQuery = banksRef.where("name", "==", bankName);

        for (const entry of entriesToDelete) {
            await bankQuery.get()
                .then(async (snapshot) => {
                    if (!snapshot.empty) {
                        const bankDoc = snapshot.docs[0];
                        const entriesRef = bankDoc.ref.collection("entries");

                        const entryQuery = entriesRef.where(
                            "date", "==", entry.date,
                            "checkings", "==", entry.checkings,
                            "savings", "==", entry.savings,
                            "other", "==", entry.other,
                        );

                        const querySnapshot = await entryQuery.get();

                        if (!querySnapshot.empty) {
                            querySnapshot.docs[0].ref.delete();
                        }

                    } else {
                        res.status(404).json({ error: "Bank not found" });
                    }
                })
                .catch((e) => {
                    console.error(e.message);
                    res.status(500).json({ error: "Server error." });
                })
        }
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." })
    }
});

router.get("/get-bank-data", async (req, res) => {
    try {
        const { user_id, bankName } = req.query;

        const userRef = Users.doc(user_id);
        const banksRef = userRef.collection("banks");
        const bankQuery = banksRef.where("name", "==", bankName);

        const snapshot = await bankQuery.get();

        const allBankData = [];

        for (let i = 0; i < snapshot.docs.length; i++) {
            const bankDoc = snapshot.docs[i];
            const entriesSnapshot = await bankDoc.ref.collection("entries").get();

            entriesSnapshot.forEach((entryDoc) => {
                const entryData = entryDoc.data();

                const bankData = {
                    date: entryData.date,
                    checkings: entryData.checkings,
                    savings: entryData.savings,
                    other: entryData.other
                };

                allBankData.push(bankData);
            });
        }

        res.status(200).json({ allBankData });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});


module.exports = router;
