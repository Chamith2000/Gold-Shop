import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreActivity } from "../types";
import { api } from "../services/api";

interface TrafficContextType {
  activity: StoreActivity | null;
  isLoading: boolean;
  isLive: boolean;
  refreshTraffic: () => Promise<void>;
}

const defaultActivity: StoreActivity = {
  id: "activity-default",
  currentVisitorCount: 8,
  trafficLevel: "LOW",
  estimatedWaitMinutes: 5,
  storeStatus: "OPEN",
  peakHoursNote: "Store is currently serene. Ideal for private bespoke viewing.",
  updatedAt: new Date().toISOString(),
};

const TrafficContext = createContext<TrafficContextType | undefined>(undefined);

export const TrafficProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activity, setActivity] = useState<StoreActivity | null>(defaultActivity);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  const fetchTraffic = async () => {
    try {
      const data = await api.storeActivity.getLive();
      setActivity(data);
    } catch (e) {
      console.error("Traffic fetch failed, using cached state", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();

    // Setup Server-Sent Events (SSE) for Real-Time Store Traffic
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/store-activity/live/stream");

      eventSource.onopen = () => {
        setIsLive(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const updated = JSON.parse(event.data);
          setActivity(updated);
        } catch {
          // ignore
        }
      };

      eventSource.onerror = () => {
        setIsLive(false);
        if (eventSource) {
          eventSource.close();
        }
      };
    } catch {
      setIsLive(false);
    }

    // Backup polling every 15 seconds if SSE disconnects
    const interval = setInterval(() => {
      if (!isLive) {
        fetchTraffic();
      }
    }, 15000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, [isLive]);

  return (
    <TrafficContext.Provider
      value={{
        activity,
        isLoading,
        isLive,
        refreshTraffic: fetchTraffic,
      }}
    >
      {children}
    </TrafficContext.Provider>
  );
};

export const useTraffic = () => {
  const context = useContext(TrafficContext);
  if (!context) throw new Error("useTraffic must be used within a TrafficProvider");
  return context;
};
