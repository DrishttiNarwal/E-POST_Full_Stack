import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "../ui/use-toast"

// Sample data for containers
const containers = [
  {
    id: "CNT-1001",
    destination: "New York, NY",
    capacity: "75%",
    status: "Medium",
    statusColor: "yellow",
    parcelsCount: 8,
  },
  {
    id: "CNT-1002",
    destination: "Los Angeles, CA",
    capacity: "30%",
    status: "Low",
    statusColor: "blue",
    parcelsCount: 3,
  },
  {
    id: "CNT-1003",
    destination: "Chicago, IL",
    capacity: "95%",
    status: "Full",
    statusColor: "red",
    parcelsCount: 12,
  },
  {
    id: "CNT-1004",
    destination: "Houston, TX",
    capacity: "60%",
    status: "Medium",
    statusColor: "yellow",
    parcelsCount: 6,
  },
  {
    id: "CNT-1005",
    destination: "Miami, FL",
    capacity: "20%",
    status: "Low",
    statusColor: "blue",
    parcelsCount: 2,
  },
  {
    id: "CNT-1006",
    destination: "Seattle, WA",
    capacity: "85%",
    status: "Full",
    statusColor: "red",
    parcelsCount: 10,
  },
]

export function ContainerList() {
  const [page, setPage] = useState(1)
  const { toast } = useToast()

  const itemsPerPage = 5
  const totalPages = Math.ceil(containers.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentContainers = containers.slice(startIndex, endIndex)

  const handleDelete = (id: string) => {
    toast({
      title: "Container deleted",
      description: `Container ${id} has been deleted.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Container ID</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Parcels</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentContainers.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="font-medium">{container.id}</TableCell>
                <TableCell>{container.destination}</TableCell>
                <TableCell>{container.capacity}</TableCell>
                <TableCell>{container.parcelsCount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      container.statusColor === "red"
                        ? "destructive"
                        : container.statusColor === "yellow"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {container.status}
                  </Badge>
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
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Container</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(container.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Container</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">{Math.min(endIndex, containers.length)}</span> of{" "}
          <span className="font-medium">{containers.length}</span> containers
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
