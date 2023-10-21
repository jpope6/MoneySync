import { useContext } from "react";
import { BackendUrlContext } from "../context/BackendUrlContext";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export function useUserBanks() {
    const [user, setUser] = useContext(UserContext)
    const backendUrl = useContext(BackendUrlContext);

    const fetchBankNames = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/users/get-bank-names`, {
                params: {
                    user_id: user.user.uid
                }
            });

            return response.data.bankNames;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    const addBank = async (bankName) => {
        try {
            if (!user) {
                console.error("User is undefined");
                return;
            }

            const body = { name: bankName, user_id: user.user.uid }

            // Send a POST request to add the bank
            await axios.post(
                `${backendUrl}/api/users/add-bank`,
                body
            );
        } catch (e) {
            console.log(e);
        }

    };

    const addBankEntry = async (bankName, date, checkingsAmt, savingsAmt, otherAmt) => {
        try {
            const body = {
                user_id: user.user.uid,
                bankName: bankName,
                date: date,
                checkingsAmt: checkingsAmt,
                savingsAmt: savingsAmt,
                otherAmt: otherAmt,
            }

            await axios.post(
                `${backendUrl}/api/users/add-bank-entry`,
                body
            );

        } catch (e) {
            console.log(e);
        }
    }


    const deleteBankEntries = async (bankName, entriesToDelete) => {
        try {
            const body = {
                user_id: user.user.uid,
                bankName: bankName,
                entriesToDelete: entriesToDelete
            }

            await axios.delete(
                `${backendUrl}/api/users/delete-bank-entries`,
                { data: body }
            );

        } catch (e) {
            console.log(e);
        }
    }

    const fetchBankData = async (bankName) => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/users/get-bank-data`, {
                params: {
                    user_id: user.user.uid,
                    bankName: bankName
                }
            });

            return response.data.allBankData;
        } catch (e) {
            console.log(e);
        }
    }

    return {
        addBank,
        fetchBankNames,
        addBankEntry,
        fetchBankData,
        deleteBankEntries
    };
};
