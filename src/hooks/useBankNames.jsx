import { useEffect, useState } from "react";
import { updateDoc, arrayUnion } from "firebase/firestore";
import { useUserDoc } from "./useUserDoc";

export function useUserBanks() {
    const userDoc = useUserDoc();
    const [banks, setBanks] = useState([]);

    const fetchUserBanks = async () => {
        if (!userDoc) {
            console.error("User document not available");
            return;
        }

        try {
            const bankArray = userDoc.data().bankArray;
            const userBanks = bankArray.map(bank => bank.bankName);
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
            await userDoc.update({
                bankArray: arrayUnion(bankName)
            });
            fetchUserBanks(); // Refresh the list after adding a new bank
        } catch (error) {
            console.error("Error adding bank:", error);
        }
    };

    useEffect(() => {
        if (userDoc) {
            fetchUserBanks();
        }
    }, [userDoc]);

    return { banks, addBank };
}
