import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUserDoc } from "./useUserDoc";

export function useUserBanks() {
    const userDoc = useUserDoc();
    const banksCollection = collection(db, 'banks');
    const [banks, setBanks] = useState([]);

    const fetchUserBanks = async () => {
        if (!userDoc) {
            console.error("User document not available");
            return;
        }

        const userBankQuery = query(
            banksCollection,
            where('userId', '==', userDoc.id)
        );

        try {
            const snapshot = await getDocs(userBankQuery);
            const userBanks = snapshot.docs.map(doc => doc.data().bankName);
            setBanks(userBanks);
        } catch (error) {
            console.error("Error fetching user banks:", error);
        }
    };

    const addBank = async (bankName) => {
        if (!userDoc) {
            console.error("User document not available");
            return;
        }

        try {
            await addDoc(banksCollection, {
                userId: userDoc.id,
                bankName,
            });
            fetchUserBanks(); // Refresh the list after adding a new bank
        } catch (error) {
            console.error("Error adding bank:", error);
        }
    };

    useEffect(() => {
        if (userDoc) {
            fetchUserBanks()
        }
    }, [userDoc, banksCollection]);

    return { banks, addBank };
}
