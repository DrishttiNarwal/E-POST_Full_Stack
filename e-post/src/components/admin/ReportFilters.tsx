import  { useState, useEffect } from "react"; // Import React hooks
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePicker } from "../ui/date-picker"; 
import { Filter, RefreshCw } from "lucide-react";
// import { fetchBranches } from '../services/api'; // Example: Import API service

// --- Define Filter State Structure ---
export interface ReportFilterValues {
  reportType: string;
  branchId: string; // Use 'all' or specific branch ID
  startDate: Date | undefined;
  endDate: Date | undefined;
}

// --- Define Branch Type (if fetching dynamically) ---
interface BranchOption {
  id: string;
  name: string;
}

// --- Component Props ---
interface ReportFiltersProps {
  initialFilters: ReportFilterValues;
  onFiltersChange: (filters: ReportFilterValues) => void; // Callback when filters change and Apply is clicked
  // Optional: could also have callbacks for immediate changes if needed
}

export function ReportFilters({
  initialFilters,
  onFiltersChange,
}: ReportFiltersProps) {
  // --- State for Local Filter Management ---
  // Keep local state to allow users to change multiple filters before applying
  const [currentFilters, setCurrentFilters] =
    useState<ReportFilterValues>(initialFilters);
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]); // State for dynamic branches
  const [isLoadingBranches, setIsLoadingBranches] = useState<boolean>(false);

  // --- MERN Integration: Fetch Branch Options ---
  useEffect(() => {
    const loadBranches = async () => {
      setIsLoadingBranches(true);
      try {
        // ** Replace with your actual API call to fetch branches **
        // const branches = await fetchBranches();
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
        const fetchedBranches: BranchOption[] = [
          { id: "br-001", name: "New York Central" },
          { id: "br-002", name: "Los Angeles Hub" },
          { id: "br-003", name: "Chicago North" },
          { id: "br-004", name: "Houston Central" },
          { id: "br-005", name: "Miami Beach" },
          // Add more fetched branches here
        ];
        setBranchOptions(fetchedBranches);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        // Handle error appropriately (e.g., show a toast message)
      } finally {
        setIsLoadingBranches(false);
      }
    };
    loadBranches();
  }, []); // Run once on mount

  // --- Event Handlers ---
  const handleSelectChange = (field: keyof ReportFilterValues) => (value: string) => {
    setCurrentFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange =
    (field: "startDate" | "endDate") => (date: Date | undefined) => {
      setCurrentFilters((prev) => ({ ...prev, [field]: date }));
    };

  const handleApplyFilters = () => {
    onFiltersChange(currentFilters); // Pass the current local state up to the parent
  };

  const handleResetFilters = () => {
    // Reset local state to initial state provided by parent (or a default state)
    const defaultFilters: ReportFilterValues = {
        reportType: 'delivery',
        branchId: 'all',
        startDate: undefined,
        endDate: undefined
    };
    setCurrentFilters(defaultFilters);
    onFiltersChange(defaultFilters); // Also notify parent about the reset
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Report Type Select */}
          <div className="grid gap-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select
              value={currentFilters.reportType}
              onValueChange={handleSelectChange("reportType")}
            >
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">Delivery Performance</SelectItem>
                <SelectItem value="volume">Parcel Volume</SelectItem>
                <SelectItem value="revenue">Revenue Analysis</SelectItem>
                <SelectItem value="customer">Customer Satisfaction</SelectItem>
                <SelectItem value="staff">Staff Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Branch Select */}
          <div className="grid gap-2">
            <Label htmlFor="branch">Branch</Label>
            <Select
              value={currentFilters.branchId}
              onValueChange={handleSelectChange("branchId")}
              disabled={isLoadingBranches} // Disable while loading
            >
              <SelectTrigger id="branch">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {isLoadingBranches ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  branchOptions.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))
                )}
                {/* Fallback if loading fails or no branches */}
                {!isLoadingBranches && branchOptions.length === 0 && (
                     <SelectItem value="no-branches" disabled>No branches found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date Picker */}
          <div className="grid gap-2">
            <Label>Start Date</Label>
            {/* Ensure DatePicker props match its implementation */}
            {/* Common props might be 'selected' or 'value', and 'onSelect' or 'onChange' */}
            <DatePicker/>
          </div>

          {/* End Date Picker */}
          <div className="grid gap-2">
            <Label>End Date</Label>
            <DatePicker/>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button size="sm" onClick={handleApplyFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}