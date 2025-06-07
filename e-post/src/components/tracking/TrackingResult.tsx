import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Package, MapPin, Calendar, Clock, Truck } from "lucide-react"
import api from "../../lib/api"

type TrackingResultProps = {
  parcel?: any;
  loading?: boolean;
  error?: string | null;
};

export function TrackingResult({ parcel, loading, error }: TrackingResultProps) {
  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (parcel?._id) {
        setLogsLoading(true);
        try {
          const res = await api.get(`/parcels/track/${parcel._id}`);
          setTrackingLogs(res.data.trackingLogs || []);
          console.log(res.data);
        } catch {
          setTrackingLogs([]);
        } finally {
          setLogsLoading(false);
        }
      } else {
        setTrackingLogs([]);
      }
    };
    fetchLogs();
  }, [parcel?._id]);

  if (loading || logsLoading) {
    return <div className="p-4">Loading...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }
  if (!parcel) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Tracking Details: {parcel.trackingId}</CardTitle>
              <CardDescription>Current status and delivery information</CardDescription>
            </div>
            <Badge className="w-fit" variant="outline">
              {parcel.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Sender Address</p>
                    <p className="text-sm font-medium">{parcel.sender?.address}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Sender Pin</p>
                    <p className="text-sm font-medium">{parcel.sender?.pin}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Receiver Name</p>
                    <p className="text-sm font-medium">{parcel.receiver?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Receiver Address</p>
                    <p className="text-sm font-medium">{parcel.receiver?.address}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Receiver Phone</p>
                    <p className="text-sm font-medium">{parcel.receiver?.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Current Location</p>
                    <p className="text-sm font-medium">{parcel.location}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tracking History</h3>
              <div className="space-y-4">
                {trackingLogs && trackingLogs.length > 0 ? (
                  trackingLogs.map((event, index) => (
                    <div key={index} className="relative pl-6 pb-4">
                      {index !== trackingLogs.length - 1 && (
                        <div className="absolute top-0 left-[11px] h-full w-[1px] bg-border"></div>
                      )}
                      <div className="absolute top-0 left-0 rounded-full">
                        <Truck className="h-[22px] w-[22px] text-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{event.status}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {event.timestamp
                              ? new Date(event.timestamp).toLocaleDateString()
                              : ""}
                            <Clock className="ml-2 mr-1 h-3 w-3" />
                            {event.timestamp
                              ? new Date(event.timestamp).toLocaleTimeString()
                              : ""}
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No tracking history found.</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

