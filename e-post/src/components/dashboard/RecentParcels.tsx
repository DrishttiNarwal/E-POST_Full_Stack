// src/components/RecentParcels.tsx (or relevant path)
// Removed "use client" directive

import { useState, useEffect } from "react"; // Import React hooks
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"; // Assuming relative paths
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Loader2 } from "lucide-react"; // Icon
import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import { fetchRecentParcels } from '../services/api'; // Example API service import

// --- Define Data Type for Parcel ---
interface Parcel {
  id: string; // Or number
  _id?: string; // Optional MongoDB ID
  parcelTrackingId?: string; // Display ID might differ from DB _id
  destination: string;
  status: string; // e.g., "Processing", "In Transit", "Delivered", "Issue"
  date: string; // Or Date object
  // Remove statusColor - we'll map status text to variant
}

// --- Client-side mapping for Status -> Badge Variant ---
type BadgeVariant = "default" | "secondary" | "outline" | "destructive" | null | undefined;

const statusVariantMap: { [key: string]: BadgeVariant } = {
  "Delivered": "default", // Green in shadcn default theme
  "Processing": "secondary", // Grey
  "In Transit": "outline", // Often yellow-ish outline depending on theme vars
  "Issue": "destructive", // Red
  "Pending": "secondary",
  // Add other statuses as needed
};

export function RecentParcels() {
  // --- State for Fetched Data ---
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- MERN Integration: Fetch Recent Parcels ---
  useEffect(() => {
    const loadRecentParcels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ** Replace with your actual API call **
        // Example using fetch (fetching latest 4 parcels):
        const response = await fetch("/api/parcels?limit=4&sort=date:desc"); // Adjust endpoint/params
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Parcel[] = await response.json();
        setParcels(data);

        // Example using imported service:
        // const data = await fetchRecentParcels(4); // Pass limit
        // setParcels(data);

      } catch (err: any) {
        setError(err.message || "Failed to load recent parcels.");
        setParcels([]); // Clear parcels on error
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentParcels();
  }, []); // Run once on mount

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Recent Parcels</CardTitle>
          <CardDescription>Latest parcel activities</CardDescription>
        </div>
        {/* Optional: Add a refresh button here */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
             <p className="text-sm text-red-500 text-center py-6">Error: {error}</p>
          )}

          {/* Empty State */}
          {!isLoading && !error && parcels.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-6">No recent parcels found.</p>
          )}

          {/* Parcel List */}
          {!isLoading && !error && parcels.length > 0 && (
             parcels.map((parcel) => (
              <div key={parcel.id || parcel._id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {parcel.parcelTrackingId || parcel.id} {/* Display user-friendly ID if available */}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {parcel.destination}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   {/* Use client-side map to get the variant */}
                  <Badge variant={statusVariantMap[parcel.status] ?? 'secondary'}>
                    {parcel.status}
                  </Badge>
                </div>
              </div>
             ))
          )}

          {/* "View All" Button */}
          {/* Use Link from react-router-dom, change href to 'to' */}
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/dashboard/parcels"> {/* Ensure this route exists */}
              View all parcels
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}