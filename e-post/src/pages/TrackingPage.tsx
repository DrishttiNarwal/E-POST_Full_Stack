import { useState } from "react";
import { TrackingSearch } from "../components/tracking/TrackingSearch";
import { TrackingResult } from "../components/tracking/TrackingResult";
import api from "../lib/api";

export default function TrackingPage() {
  const [parcel, setParcel] = useState<any>(null);
  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (trackingId: string) => {
    setLoading(true);
    setError(null);
    setParcel(null);
    setTrackingLogs([]);
    try {
      const res = await api.get(`/parcels/track/${trackingId}`);
      setParcel(res.data.parcel);
      setTrackingLogs(res.data.trackingLogs);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Parcel not found or an error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Track Parcels</h1>
      <TrackingSearch onSearch={handleSearch} loading={loading} />
      <TrackingResult parcel={parcel} trackingLogs={trackingLogs} loading={loading} error={error} />
    </div>
  );
}

