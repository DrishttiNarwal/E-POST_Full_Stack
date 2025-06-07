import React, { useState, useEffect } from "react"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "../ui/use-toast";
// Import your API service/fetch function if you have one
// import { fetchBranches, deleteBranch } from '../services/api'; // Example

// Define the Branch type (good practice in TypeScript)
interface Branch {
  id: string; // Assuming ID is string, adjust if it's a number
  name: string;
  address: string;
  manager: string;
  staff: number;
  status: string; // Consider using a union type: 'Active' | 'Under Renovation' | 'Closed'
  openDate: string; // Could be Date object if needed
  // Add any other relevant fields from your backend model
  _id?: string; // Often Mongoose adds an _id field
}

// Sample data - ** Replace this with API call in a real MERN app **
const initialBranches: Branch[] = [
  // ... (your sample data remains the same for initial display or fallback)
  {
    id: "BR-001",
    name: "New York Central",
    address: "123 Broadway, New York, NY 10001",
    manager: "John Smith",
    staff: 24,
    status: "Active",
    openDate: "2020-03-15",
  },
  {
    id: "BR-002",
    name: "Los Angeles Hub",
    address: "456 Hollywood Blvd, Los Angeles, CA 90028",
    manager: "Emily Davis",
    staff: 18,
    status: "Active",
    openDate: "2020-05-22",
  },
  // ... other branches
];

export function BranchList() {
  // --- State Management ---
  const [branches, setBranches] = useState<Branch[]>(initialBranches); // State to hold branches from API
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for API calls
  const [error, setError] = useState<string | null>(null); // Error state for API calls
  const [page, setPage] = useState(1); // Pagination state
  const { toast } = useToast(); // Toast notifications

  const itemsPerPage = 5; // Or get from config/props

  // --- MERN Integration: Fetch Data ---
  useEffect(() => {
    const loadBranches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ** Replace with your actual API call **
        // Example using fetch:
        const response = await fetch("/api/branches"); // Your backend endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Branch[] = await response.json();
        setBranches(data);

        // Example using an imported service function:
        // const data = await fetchBranches();
        // setBranches(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch branches.");
        setBranches(initialBranches); // Optionally fallback to initial data on error
        toast({
          title: "Error",
          description: "Could not load branch data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBranches();
  }, [toast]); // Re-fetch if needed based on dependencies (e.g., filters change)

  // --- Pagination Logic ---
  // Note: For large datasets, pagination should ideally be handled server-side.
  // This client-side pagination is suitable for smaller lists.
  const totalItems = branches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentBranches = branches.slice(startIndex, endIndex);

  // --- MERN Integration: Delete Action ---
  const handleDelete = async (id: string) => {
    // ** Replace with your actual API call **
    try {
      // Example using fetch:
      const response = await fetch(`/api/branches/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Example using an imported service function:
      // await deleteBranch(id);

      // Remove branch from local state to update UI immediately
      setBranches((prevBranches) =>
        prevBranches.filter((branch) => branch.id !== id || branch._id !== id) // Check both potential IDs
      );

      toast({
        title: "Branch removed",
        description: `Branch ${id} has been removed.`,
      });

      // Adjust page if the last item on the current page was deleted
      if (currentBranches.length === 1 && page > 1) {
        setPage(page - 1);
      }
      // Or maybe force a refetch: loadBranches();
    } catch (err: any) {
      setError(err.message || "Failed to delete branch.");
      toast({
        title: "Error",
        description: "Could not remove the branch.",
        variant: "destructive",
      });
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div className="p-4 text-center">Loading branches...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Consider adding a button here to trigger adding a new branch */}
      {/* <Button>Add New Branch</Button> */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Manager</TableHead>
              <TableHead className="hidden md:table-cell">Staff</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Open Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBranches.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No branches found.
                </TableCell>
              </TableRow>
            ) : (
              currentBranches.map((branch) => (
                <TableRow key={branch.id || branch._id}>
                  {/* Use a unique key */}
                  <TableCell className="font-medium">{branch.id}</TableCell>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {branch.manager}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {branch.staff}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        branch.status === "Active"
                          ? "default"
                          : branch.status === "Under Renovation"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(branch.openDate).toLocaleDateString()} {/* Format date */}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onSelect={() => {
                            /* Implement View Details Logic - e.g., navigate or open modal */
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            /* Implement Edit Branch Logic - e.g., navigate or open modal */
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Branch</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600" // Add styling for destructive action
                          onSelect={() => handleDelete(branch.id || branch._id!)} // Pass appropriate ID
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Remove Branch</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls - Only show if there's more than one page */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{totalItems}</span> branches
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm px-2">
              Page {page} of {totalPages}
            </span>{" "}
            {/* Optional: show current page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}