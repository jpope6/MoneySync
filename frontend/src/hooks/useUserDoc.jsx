import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../context/UserContext";

export function useUserDoc() {
    const [user, setUser] = useContext(UserContext);
    const [userDoc, setUserDoc] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user.user) {
                    const userRef = doc(db, "users", user.user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        setUserDoc(userDoc);
                    } else {
                        console.log("User document not found in Firestore");
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [user]);

    return userDoc;
}
