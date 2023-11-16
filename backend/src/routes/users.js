const express = require("express");
const { firestore } = require("firebase-admin");
const router = express.Router();

var admin = require("firebase-admin");
const db = admin.firestore();
const Users = db.collection("users");


router.post("/add-bank", async (req, res) => {
    try {
        const { name, user_id } = req.body;

        const userRef = Users.doc(user_id);

        // Add the bank name to the bank names array
        await userRef.update({
            bankNames: firestore.FieldValue.arrayUnion(name),
        })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });

        const yearsRef = userRef.collection("years").doc(new Date().getFullYear().toString());

        // Add the new bank to the current years document
        await yearsRef.set({
            [name]: []
        }, { merge: true })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });


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
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const bankNames = userDoc.data().bankNames || [];

        res.status(200).json({ bankNames });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Server error." });
    }
});


router.put("/add-bank-row", async (req, res) => {
    try {
        const { user_id, categoryName } = req.body;

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
        const { user_id } = req.query;

        const userRef = Users.doc(user_id);
        const yearsRef = userRef.collection("years");
        const querySnapshot = await yearsRef.get();

        const allBankData = {};

        for (const yearDoc of querySnapshot.docs) {
            const yearName = yearDoc.id;
            const yearData = yearDoc.data();

            // Initialize an object to store bank data for this year
            allBankData[yearName] = {};

            // Iterate over the banks in the yearData
            for (const [bankName, bankData] of Object.entries(yearData)) {
                // Add the bank data to the corresponding year and bank
                allBankData[yearName][bankName] = bankData;
            }
        }

        console.log(allBankData);

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
