import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import api from "../lib/api";

// --- Types ---
export type Parcel = {
  _id?: string;
  trackingId?: string;
  sender?: { address: string; pin: string };
  receiver?: { name: string; address: string; phone: string };
  location: string;
  status?: string;
  createdAt?: string;
};

type ParcelsContextType = {
  parcels: Parcel[];
  loading: boolean;
  fetchParcels: () => Promise<any>;
  createParcel: (parcel: Omit<Parcel, "_id" | "trackingId" | "createdAt" | "status">) => Promise<any>;
};

const ParcelsContext = createContext<ParcelsContextType | undefined>(undefined);

export function ParcelsProvider({ children }: { children: ReactNode }) {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchParcels = async (): Promise<any> => {
    setLoading(true);
    try {
      // Use the correct endpoint for the user's role
      const response = await api.get("/parcels/getParcels");
      setParcels(response.data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      return err.response;
    } finally {
      setLoading(false);
    }
  };

  const createParcel = async (
    parcel: Omit<Parcel, "_id" | "trackingId" | "createdAt" | "status">
  ) => {
    setLoading(true);
    try {
      const res = await api.post<Parcel>("/parcels/create", parcel);
      // Do not mutate local state, always fetch after create for consistency
      return res.data;
    } catch (err: any) {
      console.error("Error creating parcel:", err);
      return err.response;
    } finally {
      setLoading(false);
    }
  };

  const value: ParcelsContextType = {
    parcels,
    loading,
    fetchParcels,
    createParcel,
  };

  return (
    <ParcelsContext.Provider value={value}>{children}</ParcelsContext.Provider>
  );
}

export function useParcels() {
  const context = useContext(ParcelsContext);
  if (!context) {
    throw new Error("useParcels must be used within a ParcelsProvider");
  }
  return context;
}