import React, { useState, useCallback } from 'react'; // Import React hooks
import { ReportFilters, type ReportFilterValues } from "../../components/admin/ReportFilters"; // Import component and type
import { ReportCharts } from "../../components/admin/ReportCharts";
import { ReportTable } from "../../components/admin/ReportTable";

// Define the default/initial state for the filters
const initialReportFilters: ReportFilterValues = {
  reportType: 'delivery', // Default report type
  branchId: 'all',       // Default branch
  startDate: undefined,  // Default start date
  endDate: undefined,    // Default end date
};

export default function ReportsPage() {
  // --- State to hold the currently applied filters ---
  const [currentFilters, setCurrentFilters] = useState<ReportFilterValues>(initialReportFilters);

  // --- Callback function to update filters when ReportFilters applies changes ---
  // Use useCallback to prevent unnecessary re-renders of ReportFilters if ReportsPage re-renders
  const handleFiltersChange = useCallback((newFilters: ReportFilterValues) => {
    console.log("Filters changed in ReportsPage:", newFilters); // For debugging
    setCurrentFilters(newFilters);
    // Trigger data fetching for charts/table based on newFilters here or within those components using useEffect
  }, []); // Empty dependency array means this function reference doesn't change

  return (
    <div className="space-y-6 p-4 md:p-6"> {/* Added padding */}
      <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>

      {/* --- Render ReportFilters and pass required props --- */}
      <ReportFilters
        initialFilters={currentFilters} // Pass the current state as initial values
        onFiltersChange={handleFiltersChange} // Pass the handler function
      />

      {/* --- Render ReportCharts and ReportTable, passing the current filters --- */}
      {/* NOTE: You'll need to update ReportCharts and ReportTable to accept and use these filters */}
      <ReportCharts/>
      <ReportTable/>
    </div>
  );
}
