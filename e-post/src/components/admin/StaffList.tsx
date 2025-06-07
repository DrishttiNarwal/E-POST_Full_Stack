import React, { useState, useEffect } from "react"; // Import React and hooks
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"; // Assuming relative path
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
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../ui/use-toast";
// import { fetchStaff, deleteStaffMember } from '../services/api'; // Example API service import

// --- Define Staff Member Type ---
interface StaffMember {
  id: string; // Or number, depending on your backend ID type
  _id?: string; // Often included by MongoDB/Mongoose
  name: string;
  email: string;
  role: string; // Could be a specific union type: 'Manager' | 'Supervisor' | ...
  branch: string; // Or maybe a Branch object/ID { id: string; name: string }
  status: string; // Could be a specific union type: 'Active' | 'On Leave' | 'Inactive'
  joinDate: string; // Or Date object
  // Add any other relevant fields from your backend model
}

// Initial empty state or sample data for immediate display (optional)
const initialStaff: StaffMember[] = [
    // You can keep the sample data here if you want a quick visual fallback
    // or just use an empty array: []
    {
        id: "STF-001", name: "John Smith", email: "john.smith@example.com", role: "Manager", branch: "New York", status: "Active", joinDate: "2021-05-12",
    },
    // ... other sample data
];

export function StaffList() {
  // --- State Management ---
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaff); // State for staff data
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [page, setPage] = useState(1); // Pagination state
  const { toast } = useToast(); // Toast notifications

  const itemsPerPage = 5; // Configure items per page

  // --- MERN Integration: Fetch Staff Data ---
  useEffect(() => {
    const loadStaff = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ** Replace with your actual API call **
        // Example using fetch:
        const response = await fetch("/api/staff"); // Your backend endpoint for staff
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: StaffMember[] = await response.json();
        setStaffMembers(data);

        // Example using an imported service function:
        // const data = await fetchStaff();
        // setStaffMembers(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch staff data.");
        setStaffMembers(initialStaff); // Optional: Fallback to initial data
        toast({
          title: "Error",
          description: "Could not load staff data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, [toast]); // Dependency array

  // --- Pagination Logic ---
  // Again, consider server-side pagination for large datasets
  const totalItems = staffMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentStaff = staffMembers.slice(startIndex, endIndex);

  // --- MERN Integration: Delete Action ---
  const handleDelete = async (staffId: string) => {
    // ** Replace with your actual API call **
    try {
        // Optimistic UI update (optional): remove immediately
        // const originalStaff = [...staffMembers];
        // setStaffMembers(prevStaff => prevStaff.filter(staff => staff.id !== staffId && staff._id !== staffId));

        // Example using fetch:
        const response = await fetch(`/api/staff/${staffId}`, { method: 'DELETE' });
        if (!response.ok) {
            // If error, revert optimistic update
            // setStaffMembers(originalStaff);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Example using imported service:
        // await deleteStaffMember(staffId);

        // If not using optimistic update, remove after successful response:
         setStaffMembers(prevStaff => prevStaff.filter(staff => staff.id !== staffId && staff._id !== staffId));


        toast({
            title: "Staff member removed",
            description: `Staff member ${staffId} has been removed.`,
        });

        // Adjust page if the last item on the current page was deleted
        if (currentStaff.length === 1 && page > 1) {
            setPage(page - 1);
        }
         // Optional: force a refetch if pagination/total count changes significantly
         // loadStaff();

    } catch (err: any) {
        setError(err.message || "Failed to remove staff member.");
        toast({
            title: "Error",
            description: "Could not remove the staff member.",
            variant: "destructive",
        });
        // Ensure UI consistency in case of error (e.g., refetch or revert optimistic update)
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div className="p-4 text-center">Loading staff members...</div>;
  }

  if (error && staffMembers.length <= initialStaff.length) { // Show error only if data wasn't loaded successfully before
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
        {/* Optional: Add button to add new staff */}
        {/* <Button>Add New Staff</Button> */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStaff.length === 0 && !isLoading ? (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                    No staff members found.
                    </TableCell>
                </TableRow>
            ) : (
                currentStaff.map((staff) => (
                <TableRow key={staff.id || staff._id}> {/* Use unique key */}
                    <TableCell className="font-medium">{staff.id}</TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{staff.email}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell className="hidden md:table-cell">{staff.branch}</TableCell> {/* If branch is object, use staff.branch.name */}
                    <TableCell>
                    <Badge
                        variant={
                        staff.status === "Active" ? "default" : staff.status === "On Leave" ? "outline" : "secondary"
                        }
                    >
                        {staff.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(staff.joinDate).toLocaleDateString()}</TableCell> {/* Format date */}
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
                        <DropdownMenuItem onSelect={() => { /* Navigate to view details page or open modal */ }}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { /* Navigate to edit page or open modal */ }}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Staff</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                             className="text-red-600"
                             onSelect={() => handleDelete(staff.id || staff._id!)} // Pass appropriate ID
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remove Staff</span>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{endIndex}</span> of{" "}
                <span className="font-medium">{totalItems}</span> staff members
                </div>
                <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                </Button>
                <span className="text-sm px-2">
                    Page {page} of {totalPages}
                 </span> {/* Optional: show current page */}
                <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                </Button>
                </div>
            </div>
        )}
    </div>
  );
}