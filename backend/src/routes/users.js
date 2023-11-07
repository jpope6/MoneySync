const express = require("express");
const router = express.Router();


var admin = require("firebase-admin");
const db = admin.firestore();
const Users = db.collection("users");

router.post("/test-endpoint", (req, res) => {
    try {
        res.status(200).json({ message: "This is a test endpoint" });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});


router.post("/add-bank", async (req, res) => {
    try {
        const { name, user_id } = req.body;

        const userRef = Users.doc(user_id);
        const banksRef = userRef.collection("banks").doc();

        const newBankData = {
            name: name,
            color: 'black'
        };

        await banksRef.set(newBankData);

        res.status(201).json({ message: "Bank added successfully" });

    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});

router.put("/update-bank-color", async (req, res) => {
    try {
        const { user_id, bankName, newColor } = req.body;

        const userRef = Users.doc(user_id);
        const banksRef = userRef.collection("banks");
        const bankDoc = await banksRef.where("name", "==", bankName).get();

        if (bankDoc.empty) {
            res.status(404).json({ error: "Bank not found" });
            return;
        }

        // Update the color variable in the first matching bankDoc
        const docToUpdate = bankDoc.docs[0];
        await docToUpdate.ref.update({ color: newColor });

        res.status(200).json({ message: "Color updated successfully" });
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

                    const entriesRef = bankDoc.ref.collection("entries");
                    const entrySnapshot = await entriesRef.orderBy('timestamp', 'desc').limit(1).get();

                    const total = parseFloat(checkingsAmt)
                        + parseFloat(savingsAmt)
                        + parseFloat(otherAmt);

                    const newEntry = {
                        date,
                        checkings: checkingsAmt,
                        savings: savingsAmt,
                        other: otherAmt,
                        total: total.toFixed(2),
                        totalDifference: (() => {
                            if (!entrySnapshot.empty) {
                                return parseFloat((total - entrySnapshot.docs[0].data().total).toFixed(2));
                            } else {
                                return parseFloat(0);
                            }
                        })(),
                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
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
                    other: entryData.other,
                    timestamp: entryData.timestamp.toDate()
                };

                allBankData.push(bankData);
            });
        }

        allBankData.sort((a, b) => a.timestamp - b.timestamp);
        res.status(200).json({ allBankData });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});


router.get("/get-all-banks-data", async (req, res) => {
    try {
        const { user_id } = req.query;

        const userRef = Users.doc(user_id);
        const banksRef = userRef.collection("banks");
        const querySnapshot = await banksRef.get();

        const allBanksData = {};

        // Store all the dates in order to add null values later
        const allDates = [];

        for (const bankDoc of querySnapshot.docs) {
            const entriesRef = bankDoc.ref.collection("entries");
            const entrySnapshot = await entriesRef.orderBy('timestamp', 'asc').get();
            const name = bankDoc.data().name;
            const color = bankDoc.data().color;

            if (!entrySnapshot.empty) {
                const entries = entrySnapshot.docs.map((doc) => doc.data());

                if (!allBanksData[name]) {
                    allBanksData[name] = [];
                }

                const dateToEntryMap = {};

                entries.map((entry) => {
                    const date = entry.date;
                    const total = parseFloat(entry.total);
                    const timestamp = entry.timestamp.toDate();

                    // Check if the date is not already in allDates
                    if (!allDates.includes(date)) {
                        allDates.push(date);
                    }

                    if (!dateToEntryMap[date] || timestamp > dateToEntryMap[date].timestamp) {
                        dateToEntryMap[date] = {
                            name: name,
                            date: date,
                            checkings: entry.checkings,
                            savings: entry.savings,
                            other: entry.other,
                            total: total,
                            totalDifference: parseFloat(entry.totalDifference),
                            timestamp: timestamp,
                            color: color
                        };
                    }
                });

                allBanksData[name].push(...Object.values(dateToEntryMap));
            }
        }

        addNullValues(allDates, allBanksData);
        console.log(allBanksData);
        res.status(200).json({ allBanksData });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});

const addNullValues = (allDates, allBanksData) => {
    for (const bank in allBanksData) {
        const transactions = allBanksData[bank];
        const filledData = {};

        for (const date of allDates) {
            const transaction = transactions.find((t) => t.date === date);
            filledData[date] = transaction || { date, total: null, color: transactions[0].color };
        }

        allBanksData[bank] = Object.values(filledData);
        allBanksData[bank].sort((a, b) => (a.date < b.date ? -1 : 1));
    }
};



module.exports = router;
