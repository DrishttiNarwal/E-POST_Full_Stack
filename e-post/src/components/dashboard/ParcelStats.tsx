import { useState, useEffect } from "react"; // Import React hooks
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"; // Assuming relative paths
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2 } from "lucide-react"; // For loading indicator
// import { fetchParcelStats } from '../services/api'; // Example API service import

// --- Define Data Types for Stats ---
interface StatItem {
  name: string; // e.g., "Processing", "High"
  count: number;
  // Optional: color could come from API or be mapped client-side
}

interface ParcelStatsData {
  status: StatItem[];
  priority: StatItem[];
}

// --- Client-side Color Mapping (Example) ---
// Alternatively, colors could be part of the StatItem from the API
const statusColors: { [key: string]: string } = {
  Processing: "bg-blue-500",
  'In Transit': "bg-yellow-500", // Use quotes for keys with spaces
  Delivered: "bg-green-500",
  Issues: "bg-red-500",
  // Add more statuses as needed
  default: "bg-gray-400", // Fallback color
};

const priorityColors: { [key: string]: string } = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
  // Add more priorities as needed
  default: "bg-gray-400", // Fallback color
};


export function ParcelStats() {
  // --- State for Fetched Data ---
  const [statsData, setStatsData] = useState<ParcelStatsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- MERN Integration: Fetch Stats Data ---
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ** Replace with your actual API call **
        // Example using fetch:
        const response = await fetch("/api/parcels/stats"); // Your backend endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ParcelStatsData = await response.json();
        setStatsData(data);

        // Example using imported service:
        // const data = await fetchParcelStats();
        // setStatsData(data);

      } catch (err: any) {
        setError(err.message || "Failed to load parcel statistics.");
        setStatsData(null); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []); // Run once on mount

  // --- Helper to render stat list items ---
  const renderStatList = (items: StatItem[], colorMap: { [key: string]: string }) => {
    if (!items || items.length === 0) {
      return <p className="text-sm text-muted-foreground">No data available.</p>;
    }

    return items.map((item) => (
      <div key={item.name} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 flex-shrink-0 rounded-full ${colorMap[item.name] || colorMap.default}`} />
          <span className="text-sm">{item.name}</span>
        </div>
        {/* Format number with commas */}
        <span className="text-sm font-medium">{item.count?.toLocaleString() ?? '0'}</span>
      </div>
    ));
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Parcel Statistics</CardTitle>
        <CardDescription>Breakdown by status and priority</CardDescription>
      </CardHeader>
      <CardContent>
         {/* Display Loading / Error State */}
        {isLoading && (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )}
        {error && !isLoading && (
            <div className="flex h-40 items-center justify-center text-red-500">
                Error: {error}
            </div>
        )}
        {!isLoading && !error && !statsData && (
             <div className="flex h-40 items-center justify-center text-muted-foreground">
                No statistics data found.
            </div>
        )}

        {/* Display Tabs only when data is loaded successfully */}
        {!isLoading && !error && statsData && (
          <Tabs defaultValue="status">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="priority">Priority</TabsTrigger>
            </TabsList>
            {/* Status Tab Content */}
            <TabsContent value="status" className="pt-4">
              <div className="space-y-4">
                {renderStatList(statsData.status, statusColors)}
              </div>
            </TabsContent>
            {/* Priority Tab Content */}
            <TabsContent value="priority" className="pt-4">
              <div className="space-y-4">
                {renderStatList(statsData.priority, priorityColors)}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}