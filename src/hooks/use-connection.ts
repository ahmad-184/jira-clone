"use client";

import { useState, useEffect } from "react";

type ConnectionCallback = (isOnline: boolean) => void;

const useInternetConnection = (callback?: ConnectionCallback): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      callback?.(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      callback?.(false);
    };

    try {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    } catch (error) {
      console.error("Error adding event listeners:", error);
    }

    return () => {
      try {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      } catch (error) {
        console.error("Error removing event listeners:", error);
      }
    };
  }, [callback]);

  return isOnline;
};

export default useInternetConnection;
