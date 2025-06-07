import { BranchList } from "../../components/admin/BranchList"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Branch Management</h1>
        <Button asChild>
          <Link to="/dashboard/admin/branches/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Link>
        </Button>
      </div>
      <BranchList />
    </div>
  )
}

