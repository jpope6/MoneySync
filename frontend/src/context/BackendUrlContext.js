import { useState, createContext } from "react";

export const BackendUrlContext = createContext();

export function BackendUrlProvider({ children }) {
  const [backendUrl, setBackendUrl] = useState(
    process.env.NODE_ENV === "production"
      ? "https://moneysync.onrender.com"
      : "http://localhost:5000"
  );

  return (
    <BackendUrlContext.Provider value={backendUrl}>
      {children}
    </BackendUrlContext.Provider>
  );
}
