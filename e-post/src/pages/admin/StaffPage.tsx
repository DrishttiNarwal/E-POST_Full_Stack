import { StaffList } from "../../components/admin/StaffList"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
        <Button asChild>
          <Link to="/dashboard/admin/staff/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Link>
        </Button>
      </div>
      <StaffList />
    </div>
  )
}

