import { differenceInHours } from "date-fns";
import React, { useEffect } from "react";

interface TokenInputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

interface TokenStore {
  token: string;
  timestamp: string;
}

const LOCAL_STORAGE_KEY = "token_store";

const TokenInputField: React.FC<TokenInputFieldProps> = ({
  onChange,
  value,
}) => {
  useEffect(function loadTokenFromStorage() {
    try {
      const storedTokenString = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (storedTokenString !== null) {
        const tokenStore: TokenStore = JSON.parse(storedTokenString);
        const updateDate = new Date(tokenStore.timestamp);

        const hourDifference = differenceInHours(Date.now(), updateDate);

        if (hourDifference <= 4) {
          onChange(tokenStore.token);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(
    function storeToken() {
      if (value) {
        const x = window.setTimeout(() => {
          const now = new Date();

          const tokenStore: TokenStore = {
            timestamp: now.toISOString(),
            token: value,
          };

          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tokenStore));
          } catch (e) {
            console.warn(e);
          }
        }, 800);

        return () => window.clearTimeout(x);
      }
    },
    [value]
  );

  return (
    <input
      type="text"
      className="px-4 py-3 border rounded border-gray-300 flex-1 focus:shadow-outline-indigo outline-none bg-gray-50"
      placeholder="z.B. eyJhbBciO..."
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default TokenInputField;
