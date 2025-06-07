import { useParcels } from "../parcel-provider";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import React from "react";

export function ParcelList() {
  const { parcels, loading, fetchParcels } = useParcels();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold mb-4">Parcels List</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchParcels}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw className={loading ? "animate-spin mr-2 h-4 w-4" : "mr-2 h-4 w-4"} />
          Refresh
        </Button>
      </div>
      {loading && <div className="p-4">Loading...</div>}
      {!loading && !parcels.length && (
        <div className="text-muted-foreground p-4">No parcels found.</div>
      )}
      {!loading && parcels.length > 0 && (
        <ul className="space-y-2">
          {parcels.map((p, idx) => (
            <li
              key={p._id || p.trackingId || idx}
              className="flex flex-col md:flex-row md:justify-between md:items-center border-b last:border-b-0 py-2 gap-2"
            >
              <div>
                <span className="font-medium">{p.trackingId}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({p.status})
                </span>
              </div>
              <div className="text-sm">
                <div>
                  <span className="font-semibold">Receiver:</span> {p.receiver?.name}
                </div>
                <div>
                  <span className="font-semibold">Address:</span> {p.receiver?.address}
                </div>
                <div>
                  <span className="font-semibold">Phone:</span> {p.receiver?.phone}
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {p.location}
                </div>
                <div>
                  <span className="font-semibold">QR Code:</span>{" "}
                  <a
                    href={`http://localhost:5000/qrcodes/parcels/${p.trackingId}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View QR
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}