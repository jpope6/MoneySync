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
        }
    };

    const addBank = async (bankName) => {
        try {
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

    const addBankEntry = async (year, bankName, data) => {
        try {
            const body = {
                user_id: user.user.uid,
                year: year,
                bankName: bankName,
                data: data,
            }

            await axios.put(
                `${backendUrl}/api/users/add-bank-entry`,
                body
            );

        } catch (e) {
            console.log(e);
        }
    };


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

    const fetchBankData = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/users/get-bank-data`, {
                params: {
                    user_id: user.user.uid,
                }
            });

            return response.data.allBankData;
        } catch (e) {
            console.log(e);
        }
    }

    const fetchAllBanksData = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/users/get-all-banks-data`, {
                params: {
                    user_id: user.user.uid,
                }
            });

            return response.data.allBanksData;
        } catch (e) {
            console.log(e);
        }
    }

    return {
        addBank,
        fetchBankNames,
        addBankEntry,
        fetchBankData,
        deleteBankEntries,
        fetchAllBanksData
    };
};
