import { useState, createContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [auth, setAuth] = useState(localStorage.getItem("auth"));

	return (
		<AuthContext.Provider value={[auth, setAuth]}>
			{children}
		</AuthContext.Provider>
	);
};
